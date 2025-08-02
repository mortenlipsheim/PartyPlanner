import * as React from 'react';
import { Party } from '@/lib/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvitationEmailProps {
  party: Party;
}

const InvitationEmail = ({ party }: InvitationEmailProps) => {
  const previewText = `Vous êtes invité(e) à : ${party.name} !`;
  const confirmLink = `http://localhost:9002/api/rsvp?partyId=${party.id}&status=attending`;
  const declineLink = `http://localhost:9002/api/rsvp?partyId=${party.id}&status=declined`;

  const containerStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    margin: '32px auto',
    padding: '32px',
    maxWidth: '600px',
  };
  const bodyStyle = { backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' };
  const headingStyle = { fontSize: '24px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center' as const };
  const textCenterStyle = { fontSize: '18px', color: '#4b5563', textAlign: 'center' as const };
  const partyNameStyle = { fontSize: '36px', fontWeight: 'bold', color: 'hsl(16 100% 66%)', textAlign: 'center' as const, marginBottom: '-8px' };
  const sectionStyle = { marginTop: '32px' };
  const textStyle = { fontSize: '16px', lineHeight: '1.5' };
  const strongStyle = { color: '#374151' };
  const buttonContainerStyle = { marginTop: '32px', textAlign: 'center' as const };
  const buttonPrimaryStyle = { backgroundColor: 'hsl(16 100% 66%)', color: '#ffffff', fontWeight: 'bold', padding: '12px 24px', borderRadius: '0.375rem', textDecoration: 'none', marginRight: '16px' };
  const buttonSecondaryStyle = { backgroundColor: '#d1d5db', color: '#1f2937', fontWeight: 'bold', padding: '12px 24px', borderRadius: '0.375rem', textDecoration: 'none' };

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
            <p style={textStyle}><strong style={strongStyle}>Quand ?</strong> {format(party.date, 'PPPP p', { locale: fr })}</p>
            <p style={textStyle}><strong style={strongStyle}>Où ?</strong> {party.place}</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ ...headingStyle, textAlign: 'left', fontSize: '20px' }}>Au programme</h2>
            <p style={{...textStyle, color: '#4b5563'}}>{party.description}</p>
            {party.menu.length > 0 && (
              <p style={{...textStyle, color: '#4b5563', marginTop: '16px'}}>
                <strong style={strongStyle}>Menu prévu :</strong> {party.menu.join(', ')}.
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

          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '12px', marginTop: '32px' }}>
            Party Planner Pro
          </p>
        </div>
      </body>
    </html>
  );
};

export default InvitationEmail;