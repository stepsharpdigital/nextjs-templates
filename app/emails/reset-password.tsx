import * as React from "react";
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
  Tailwind,
} from "@react-email/components";

interface ForgetPasswordEmailProps {
  username: string;
  resetUrl: string;
}

const ForgotPasswordEmail = (props: ForgetPasswordEmailProps) => {
  const { username, resetUrl } = props;

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="bg-white font-sans py-10">
          <Container className="bg-white rounded-xl px-12 py-10 mx-auto max-w-150">
            <Section>
              <Heading className="text-xl font-bold text-black mb-8 text-center">
                Hello, {username}
              </Heading>
              <Heading className="text-[24px] font-bold text-black mb-8 text-center">
                Reset Your Password
              </Heading>

              <Text className="text-[16px] text-gray-800 mb-6 leading-6">
                We received a request to reset your password. If you didn&apos;t
                make this request, you can safely ignore this email.
              </Text>

              <Text className="text-[16px] text-gray-800 mb-8 leading-6">
                To reset your password, click the button below:
              </Text>

              <Section className="text-center mb-8">
                <Button
                  href={resetUrl}
                  className="bg-black text-white px-8 py-4 rounded-xl text-[16px] font-medium box-border"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-6 leading-5">
                This link will expire in 24 hours for security reasons.
              </Text>

              <Text className="text-[14px] text-gray-600 leading-5">
                If you&apos;re having trouble clicking the button, copy and
                paste this URL into your browser:
                <br />
                {resetUrl}
              </Text>
            </Section>

            <Section className="border-t border-gray-300 pt-6 mt-10">
              <Text className="text-[12px] text-gray-500 text-center m-0">
                © {new Date().getFullYear()} Your Company. All rights reserved.
                <br />
                123 Business Street, City, State 12345
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;
