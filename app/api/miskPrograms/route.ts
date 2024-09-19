import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const PROGRAMS_URL = 'https://hub.misk.org.sa/umbraco/api/MFChatbot/GetPublishedPrograms';
const JSON_FILE_PATH = path.join(process.cwd(), 'public', 'miskPrograms.json');

export async function GET() {
  try {
    let data;
    try {
      const fileContents = await readFile(JSON_FILE_PATH, 'utf8');
      data = JSON.parse(fileContents);
    } catch (error) {
      console.log('Error reading local file, fetching from API');
      const response = await fetch(PROGRAMS_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      data = await response.json();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Misk programs:', error);
    return NextResponse.json({ error: 'Failed to fetch Misk programs' }, { status: 500 });
  }
}