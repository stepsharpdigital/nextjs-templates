import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

interface OrganizationInvitationProps {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}

const OrganizationInvitationEmail = (props: OrganizationInvitationProps) => {
  const { email, invitedByUsername, invitedByEmail, teamName, inviteLink } =
    props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>You&apos;ve been invited to join {teamName}</Preview>
        <Body className="bg-white font-sans py-10">
          <Container className="mx-auto px-5 max-w-150">
            <Section className="bg-white rounded-xl p-10 border border-solid border-gray-200">
              {/* Header */}
              <Text className="text-[32px] font-bold text-black mb-8 text-center">
                You&apos;re Invited!
              </Text>

              {/* Main Content */}
              <Text className="text-[16px] text-gray-700 mb-6 leading-6">
                Hi there,
              </Text>

              <Text className="text-[16px] text-gray-700 mb-6 leading-6">
                <strong>{invitedByUsername}</strong> ({invitedByEmail}) has
                invited you to join <strong>{teamName}</strong>. You&apos;ll be able
                to collaborate with the team and access shared resources once
                you accept this invitation.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-8 leading-6">
                Click the button below to accept your invitation and get
                started:
              </Text>

              {/* CTA Button */}
              <Section className="text-center mb-8">
                <Button
                  href={inviteLink}
                  className="bg-black text-white px-8 py-4 rounded-xl text-[16px] font-semibold no-underline box-border inline-block"
                >
                  Accept Invitation
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="text-[14px] text-gray-600 mb-8 leading-5">
                If the button above doesn&apos;t work, you can copy and paste this
                link into your browser:
              </Text>

              <Text className="text-[14px] text-gray-600 mb-8 leading-5 break-all bg-gray-50 p-3 rounded-lg border border-solid border-gray-200">
                {inviteLink}
              </Text>

              <Hr className="border-gray-200 my-8" />

              {/* Additional Info */}
              <Text className="text-[14px] text-gray-600 mb-4 leading-5">
                This invitation was sent to <strong>{email}</strong>. If you
                weren&apos;t expecting this invitation, you can safely ignore this
                email.
              </Text>

              <Text className="text-[14px] text-gray-600 mb-8 leading-5">
                Questions? Feel free to reach out to {invitedByUsername} at{" "}
                {invitedByEmail}.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center">
              <Text className="text-[12px] text-gray-500 m-0 leading-4">
                © {new Date().getFullYear()} {teamName}. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 leading-4 mt-2">
                123 Business Street, Suite 100, Business City, BC 12345
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 leading-4 mt-2">
                <a href="#" className="text-gray-500 underline">
                  Unsubscribe
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrganizationInvitationEmail;
