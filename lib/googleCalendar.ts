// lib/googleCalendar.ts

interface CalendarEventParams {
  summary: string;
  description: string;
  location: string;
  startDateTime: string; // ISO String
  endDateTime: string;   // ISO String
  attendeeEmail: string;
}

/**
 * Service tích hợp Google Calendar API
 * Sẽ được gọi sau khi Booking xác nhận thanh toán thành công
 */
export async function createGoogleCalendarEvent({
  summary,
  description,
  location,
  startDateTime,
  endDateTime,
  attendeeEmail
}: CalendarEventParams) {
  try {
    // Để triển khai thực tế, bạn cần Google Service Account credentials
    // và npm package 'googleapis'
    
    /* Template Implementation:
    const { google } = require('googleapis');
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    const event = {
      summary: summary,
      location: location,
      description: description,
      start: { dateTime: startDateTime, timeZone: 'Asia/Ho_Chi_Minh' },
      end: { dateTime: endDateTime, timeZone: 'Asia/Ho_Chi_Minh' },
      attendees: [{ email: attendeeEmail }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all'
    });
    
    return { success: true, eventLink: response.data.htmlLink };
    */

    console.log("Mock Google Calendar Event Created:", summary);
    return { 
      success: true, 
      eventLink: "https://calendar.google.com/calendar/event?eid=mock_event",
      message: "Đây là function mô phỏng. Bật Auth credentials trong môi trường production để sử dụng thật."
    };

  } catch (error) {
    console.error('Lỗi khi tạo Google Calendar event:', error);
    return { success: false, error };
  }
}
