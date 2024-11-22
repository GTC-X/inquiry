import { getSingleData } from '../../lib/db';

export async function GET(req) {
    const url = new URL(req.url);
    const email = url.searchParams.get('Email_address');

    if (!email) {
        return new Response(JSON.stringify({ success: false, error: 'Email parameter is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const query = `SELECT Email_address FROM marketing_campaign WHERE Email_address =  @param0`;

    try {
        const data = await getSingleData(query, [email]);

        if (data.length > 0) {
            return new Response(JSON.stringify({ success: true, exists: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ success: true, exists: false }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
