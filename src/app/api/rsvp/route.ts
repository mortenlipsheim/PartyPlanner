import { updateAttendeeStatus } from '@/lib/party-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const partyId = searchParams.get('partyId');
  const neighborId = searchParams.get('neighborId');
  const status = searchParams.get('status');

  if (!partyId || !neighborId || (status !== 'attending' && status !== 'declined')) {
    return new NextResponse('Paramètres de requête manquants ou invalides', { status: 400 });
  }

  try {
    await updateAttendeeStatus(partyId, neighborId, status);
    
    const message = status === 'attending' 
      ? "Votre participation a bien été enregistrée. Merci !" 
      : "Nous avons bien noté votre absence. Peut-être une prochaine fois !";

    // Simple HTML response page
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation RSVP</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f3f4f6; margin: 0; }
              .container { text-align: center; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              h1 { color: #1f2937; }
              p { color: #4b5563; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Merci !</h1>
              <p>${message}</p>
          </div>
      </body>
      </html>
    `;
    
    return new NextResponse(htmlResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error: any) {
    console.error('RSVP Error:', error);
    return new NextResponse(`Erreur lors de la mise à jour de votre statut : ${error.message}`, { status: 500 });
  }
}
