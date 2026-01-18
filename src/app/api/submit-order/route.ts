import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Generate next order ID in format S-1001, S-1002, etc.
async function getNextOrderId(sheet: { getRows: () => Promise<{ get: (key: string) => string }[]> }): Promise<string> {
    try {
        const rows = await sheet.getRows();
        if (rows.length === 0) {
            return 'S-1001';
        }

        // Find the highest order number
        let maxNum = 0;
        for (const row of rows) {
            const orderId = row.get('Order ID') || '';
            const match = orderId.match(/S-(\d+)/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxNum) maxNum = num;
            }
        }

        // Increment
        const nextNum = maxNum + 1;
        return `S-${nextNum}`;
    } catch {
        // Fallback to timestamp-based ID
        return `S-${Date.now().toString().slice(-6)}`;
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            orderId, // If provided, update existing row; if not, create new
            date,
            paymentStatus, // 'Paid' or 'Abandoned Cart'
            name,
            phone,
            address, // Customer-entered address (flat, floor, building, landmark)
            coordinates, // DMS coordinates
            mapLink, // Google Maps link
            details, // Plan details or trial info
            amount,
            startDate, // Subscription start date
            deliveryInstructions // Customer delivery instructions
        } = body;

        let finalOrderId = orderId || 'S-1001';
        let isUpdate = !!orderId; // If orderId is provided, this is an update

        // 1. Append to or Update Google Sheet
        try {
            if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
                console.error('Missing Google Sheets credentials');
            } else {
                const serviceAccountAuth = new JWT({
                    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
                });

                const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
                await doc.loadInfo();
                const sheet = doc.sheetsByIndex[0];

                if (isUpdate) {
                    // UPDATE existing row - find by Order ID and update Payment Status
                    const rows = await sheet.getRows();
                    for (const row of rows) {
                        if (row.get('Order ID') === orderId) {
                            row.set('Payment Status', paymentStatus);
                            await row.save();
                            console.log(`Updated order ${orderId} to ${paymentStatus}`);
                            break;
                        }
                    }
                } else {
                    // CREATE new row
                    finalOrderId = await getNextOrderId(sheet);

                    await sheet.addRow({
                        'Order ID': finalOrderId,
                        'Payment Status': paymentStatus || 'Abandoned Cart',
                        'Date': date,
                        'Name': name,
                        'Phone': phone,
                        'Address': address,
                        'Coordinates': coordinates || '',
                        'Map Link': mapLink || '',
                        'Details': details,
                        'Amount': amount,
                        'Start Date': startDate || '',
                        'Delivery Instructions': deliveryInstructions || '',
                    });
                }
            }
        } catch (sheetError) {
            console.error('Google Sheets Error:', sheetError);
        }

        // 2. Send Email Notification (only for new orders or paid updates)
        if (!isUpdate || paymentStatus === 'Paid') {
            try {
                if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                    console.error('Missing Email credentials');
                } else {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                        },
                    });

                    const statusEmoji = paymentStatus === 'Paid' ? '✅' : '⚠️';
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: process.env.EMAIL_USER,
                        subject: `${statusEmoji} Saladly ${paymentStatus}: ${finalOrderId} - ${name}`,
                        html: `
                            <h2>${paymentStatus === 'Paid' ? 'Payment Received! 🎉' : 'New Lead - Abandoned Cart ⚠️'}</h2>
                            <p><strong>Order ID:</strong> ${finalOrderId}</p>
                            <p><strong>Payment Status:</strong> ${paymentStatus}</p>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <p><strong>Amount:</strong> ₹${amount}</p>
                            <hr/>
                            <h3>Details:</h3>
                            <p>${details}</p>
                            <p><strong>Address:</strong> ${address}</p>
                            <p><strong>Coordinates:</strong> ${coordinates || 'N/A'}</p>
                            <p><strong>Map:</strong> <a href="${mapLink}">${mapLink}</a></p>
                            ${deliveryInstructions ? `<p><strong>Delivery Instructions:</strong> ${deliveryInstructions}</p>` : ''}
                        `,
                    };

                    await transporter.sendMail(mailOptions);
                }
            } catch (emailError) {
                console.error('Email Error:', emailError);
            }
        }

        return NextResponse.json({ success: true, message: 'Order processed successfully', orderId: finalOrderId });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
