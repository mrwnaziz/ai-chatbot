import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  try {
    const { blobs } = await list();
    const programsBlob = blobs.find(blob => blob.pathname === 'miskPrograms.json');
    
    if (programsBlob) {
      const response = await fetch(programsBlob.url);
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
    console.error('Error fetching Misk programs:', error);
    return NextResponse.json({ error: 'Failed to fetch Misk programs' }, { status: 500 });
  }
}