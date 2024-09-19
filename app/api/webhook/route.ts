import { NextResponse } from 'next/server';
import { put, del, list } from '@vercel/blob';

const BASE_URL = 'https://hub.misk.org.sa/umbraco/api/MFChatbot/';
const ENDPOINTS = {
  programs: 'GetPublishedPrograms',
  events: 'GetPublishedEvents',
  insights: 'GetPublishedInsights'
};

async function deleteOldFiles() {
  const { blobs } = await list();
  for (const blob of blobs) {
    if (['miskPrograms.json', 'miskEvents.json', 'miskInsights.json'].includes(blob.pathname)) {
      await del(blob.url);
    }
  }
}

async function fetchAndSaveData(endpoint: string, blobName: string) {
  const url = BASE_URL + endpoint;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} for ${endpoint}`);
  }
  const data = await response.json();

  // Save data to Vercel Blob with public access
  await put(blobName, JSON.stringify(data), {
    contentType: 'application/json',
    access: 'public',
  });
}

export async function POST() {
  try {
    // Delete old files first
    await deleteOldFiles();

    // Then fetch and save new data
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