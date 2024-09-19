import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://hub.misk.org.sa/umbraco/api/MFChatbot/';
const ENDPOINTS = {
  programs: 'GetPublishedPrograms',
  events: 'GetPublishedEvents',
  insights: 'GetPublishedInsights'
};
const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function fetchAndSaveData(endpoint: string, fileName: string) {
  const url = BASE_URL + endpoint;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} for ${endpoint}`);
  }
  const data = await response.json();
  const filePath = path.join(PUBLIC_DIR, fileName);
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function POST() {
  try {
    await Promise.all([
      fetchAndSaveData(ENDPOINTS.programs, 'miskPrograms.json'),
      fetchAndSaveData(ENDPOINTS.events, 'miskEvents.json'),
      fetchAndSaveData(ENDPOINTS.insights, 'miskInsights.json')
    ]);

    return NextResponse.json({ message: 'All data updated and saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Failed to update and save data' }, { status: 500 });
  }
}