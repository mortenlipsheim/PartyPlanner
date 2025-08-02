import { Party } from '@/lib/types';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind
} from '@react-email/components';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvitationEmailProps {
  party: Party;
}

const InvitationEmail = ({ party }: InvitationEmailProps) => {
  const previewText = `Vous êtes invité(e) à : ${party.name} !`;

  // Note: Les liens de confirmation ne sont pas fonctionnels dans cette version
  // car ils nécessiteraient une logique backend et une base de données pour
  // suivre les réponses. Ce sont des exemples.
  const confirmLink = `http://localhost:9002/api/rsvp?partyId=${party.id}&status=attending`;
  const declineLink = `http://localhost:9002/api/rsvp?partyId=${party.id}&status=declined`;


  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg mx-auto p-8 mt-8 max-w-2xl">
            <Heading className="text-3xl font-bold text-gray-800 text-center">
              Invitation !
            </Heading>
            <Text className="text-lg text-gray-600 text-center">
              Vous êtes cordialement invité(e) à la fête :
            </Text>

            <Section className="text-center mt-6">
              <Text className="text-4xl font-headline text-primary -mb-2">
                {party.name}
              </Text>
            </Section>

            <Section className="mt-8">
              <Text className="text-base">
                <strong className="text-gray-700">Quand ?</strong> {format(party.date, 'PPPP p', { locale: fr })}
              </Text>
              <Text className="text-base">
                <strong className="text-gray-700">Où ?</strong> {party.place}
              </Text>
            </Section>

            <Section className="mt-6">
              <Heading as="h2" className="text-xl font-semibold text-gray-700">
                Au programme
              </Heading>
              <Text className="text-base text-gray-600">{party.description}</Text>
              {party.menu.length > 0 && (
                <Text className="text-base text-gray-600 mt-4">
                  <strong className="text-gray-700">Menu prévu :</strong> {party.menu.join(', ')}.
                </Text>
              )}
              {party.comments && (
                 <Text className="text-base text-gray-600 mt-4 italic">
                  "{party.comments}"
                </Text>
              )}
            </Section>
            
            <Section className="mt-8 text-center">
                <Text className="text-md text-gray-500 mb-4">Merci de nous dire si vous serez présent :</Text>
                <Button href={confirmLink} className="bg-primary text-white font-bold py-3 px-6 rounded-md mr-4">
                    Je serai là !
                </Button>
                <Button href={declineLink} className="bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md">
                    Je ne peux pas venir
                </Button>
            </Section>

            <Text className="text-center text-gray-500 text-sm mt-8">
              Party Planner Pro
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InvitationEmail;
