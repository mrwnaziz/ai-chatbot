import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  try {
    const { blobs } = await list();
    const eventsBlob = blobs.find(blob => blob.pathname === 'miskEvents.json');
    
    if (eventsBlob) {
      const response = await fetch(eventsBlob.url);
      const data = await response.json();
      
      // Simple filtering based on the query
      const filteredData = data.filter((item: any) => 
        JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
      );

      return NextResponse.json(filteredData.slice(0, 10)); // Limit to 10 results
    } else {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching Misk events:', error);
    return NextResponse.json({ error: 'Failed to fetch Misk events' }, { status: 500 });
  }
}