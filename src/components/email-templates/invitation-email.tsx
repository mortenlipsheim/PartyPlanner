import * as React from 'react';
import { Party } from '@/lib/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvitationEmailProps {
  party: Party;
  neighborId: string;
}

const InvitationEmail = ({ party, neighborId }: InvitationEmailProps) => {
  const previewText = `Vous êtes invité(e) à : ${party.name} !`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
  const confirmLink = `${baseUrl}/api/rsvp?partyId=${party.id}&neighborId=${neighborId}&status=attending`;
  const declineLink = `${baseUrl}/api/rsvp?partyId=${party.id}&neighborId=${neighborId}&status=declined`;

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    margin: '32px auto',
    padding: '32px',
    maxWidth: '600px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  };
  const bodyStyle: React.CSSProperties = { backgroundColor: '#f3f4f6', fontFamily: '"PT Sans", sans-serif' };
  const headingStyle: React.CSSProperties = { fontSize: '24px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center', fontFamily: '"Playfair Display", serif' };
  const textCenterStyle: React.CSSProperties = { fontSize: '18px', color: '#4b5563', textAlign: 'center' };
  const partyNameStyle: React.CSSProperties = { fontSize: '36px', fontWeight: 'bold', color: 'hsl(16 100% 66%)', textAlign: 'center', marginBottom: '-8px', fontFamily: '"Playfair Display", serif' };
  const sectionStyle: React.CSSProperties = { marginTop: '32px' };
  const textStyle: React.CSSProperties = { fontSize: '16px', lineHeight: '1.5', color: '#374151' };
  const strongStyle: React.CSSProperties = { color: '#1f2937', fontWeight: 'bold' };
  const buttonContainerStyle: React.CSSProperties = { marginTop: '32px', textAlign: 'center' };
  const buttonPrimaryStyle: React.CSSProperties = { backgroundColor: 'hsl(16 100% 66%)', color: '#ffffff', fontWeight: 'bold', padding: '12px 24px', borderRadius: '0.375rem', textDecoration: 'none', marginRight: '16px', display: 'inline-block' };
  const buttonSecondaryStyle: React.CSSProperties = { backgroundColor: '#d1d5db', color: '#1f2937', fontWeight: 'bold', padding: '12px 24px', borderRadius: '0.375rem', textDecoration: 'none', display: 'inline-block' };
  const footerStyle: React.CSSProperties = { textAlign: 'center', color: '#6b7280', fontSize: '12px', marginTop: '32px' };

  return (
    <html lang="fr">
      <head>
        <title>{previewText}</title>
      </head>
      <body style={bodyStyle}>
        <div style={containerStyle}>
          <h1 style={headingStyle}>Invitation !</h1>
          <p style={textCenterStyle}>Vous êtes cordialement invité(e) à la fête :</p>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={partyNameStyle}>{party.name}</p>
          </div>

          <div style={sectionStyle}>
            <p style={textStyle}><strong style={strongStyle}>Quand ?</strong> {format(new Date(party.date), 'PPPP p', { locale: fr })}</p>
            <p style={textStyle}><strong style={strongStyle}>Où ?</strong> {party.place}</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ ...headingStyle, textAlign: 'left', fontSize: '20px' }}>Au programme</h2>
            <p style={{...textStyle, color: '#4b5563'}}>{party.description}</p>
            {party.menu.length > 0 && (
              <p style={{...textStyle, color: '#4b5563', marginTop: '16px'}}>
                <strong style={strongStyle}>Menu prévu :</strong> {party.menu.map(m => m.name).join(', ')}.
              </p>
            )}
            {party.comments && (
              <p style={{...textStyle, color: '#4b5563', marginTop: '16px', fontStyle: 'italic'}}>
                "{party.comments}"
              </p>
            )}
          </div>
          
          <div style={buttonContainerStyle}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Merci de nous dire si vous serez présent :</p>
              <a href={confirmLink} style={buttonPrimaryStyle}>Je serai là !</a>
              <a href={declineLink} style={buttonSecondaryStyle}>Je ne peux pas venir</a>
          </div>

          <p style={footerStyle}>
            Party Planner Pro
          </p>
        </div>
      </body>
    </html>
  );
};

export default InvitationEmail;
