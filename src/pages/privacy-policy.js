import React from "react";
import Head from "next/head";
import { Container, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Copyright from "../components/layout/Copyright";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "30px",
  },
}));

function PrivacyPage() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Head>
        <title>{`Memoryise - Privacy Policy`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container sx={{ mt: 12 }}>
        <Grid container className={classes.container} direction="column">
          <Grid item>
            <Typography variant="h4">Privacy Policy</Typography>
            <Typography variant="body1">
              This Privacy Statement (the &quot;Statement&quot;) describes certain privacy practices of Memoryise, Inc. (&quot;Memoryise,&quot; &quot;we,&quot; or &quot;us&quot;). The Statement is
              intended to explain how we collect, use, and share your information in connection with our website at https://www.memoryise.com and any affiliated subdomains (the &quot;Website&quot;),
              and the services we offer through the Website (collectively, the &quot;Services&quot;). The Statement covers information collected from our Services, from our business partners and
              service providers, and from other sources. We may also have other privacy policies, set forth separately in writing, specific to certain categories of information or individuals, such as
              information relating to residents or citizens of certain jurisdictions.
            </Typography>

            <Typography variant="h4">What Information We Collect</Typography>
            <Typography variant="body1">
              Included below are the types of information collected on Memoryise:
              <ul>
                <li>Contact information, such as your name, address, email address, and telephone number.</li>
                <li>
                  Account login or verification information (including third-party account-verification information if you choose to sign in with Google, Facebook, or a single sign-on (SSO) provider).
                </li>
                <li>
                  Financial information, such as payment card information (e.g. credit or debit card number, CVV code, expiration date) or other financial account information. (Note that this
                  information is stored through our payment processor, Stripe, rather than on Memoryise servers. Stripe&apos;s privacy policy can be found here: https://stripe.com/privacy.)
                </li>
                <li>
                  Internet or other network or device activity, such as information about the browsers and devices you use to access our Services, emails, and advertisements (e.g. device type, browser
                  type and language, hardware model, operating system version, unique device identifiers, and IP address) and how you interact with our Services, emails, and advertisements (e.g.
                  features used, content viewed, addresses of referring websites, and the dates and times of interactions).
                </li>
                <li>Location information, including geolocation when using our Services.</li>
                <li>
                  Electronic, audio, visual, or similar information, such as your communications with us or photos, videos, or other content you submit to us or publish in connection with our
                  Services.
                </li>
                <li>Other information that identifies or can be reasonably associated with you. </li>
                <li>
                  Information such as gender, age or date of birth, marital status, military or veteran status, household composition, professional, education, or employment-related information, and
                  information about interests.
                </li>
              </ul>
            </Typography>

            <Typography variant="h4">How We Collect Information</Typography>
            <Typography variant="body1">
              We collect the types of information described above in three ways: (1) when you provide it to us; (2) when we collect it automatically; and (3) and when we receive it from other sources.
            </Typography>

            <Typography variant="h5">Information you provide to us</Typography>
            <Typography variant="body1">
              You provide information to us when you register for an account, use our Services, communicate with us, or otherwise submit or publish your information. For example, when you register for
              an account, you may provide contact information, account login or verification information, demographic information, and financial information. When using our Services, you may provide
              demographic information or other information about yourself or others, including photos or other user-generated content. You might also provide information when communicating with us
              (for example, regarding our Services or when seeking technical support) or linking to us or our Services on social media or other websites.
            </Typography>

            <Typography variant="h5">Information we collect automatically</Typography>
            <Typography variant="body1">
              We automatically collect internet or other network or device activity information about your interactions with our Services, emails, and advertisements, even if you are not logged into
              an account with us. This information may be collected as follows:
              <ul>
                <li>
                  Cookies and similar technologies.
                  <ul>
                    <li>Cookies and similar technologies are pieces of information stored directly on the device you are using.</li>
                    <li>Cookies allow us to collect information such as browser type, time spent on our Services, pages visited, and language preferences.</li>
                    <li>
                      We and our service providers use the information for security purposes, to facilitate navigation, to display information more effectively, and to personalize your online
                      experience and our marketing and advertising efforts. In addition, we use cookies to gather statistical information about usage of our Services in order to improve their design
                      and functionality, understand how they are used, and assist us with resolving questions about them.
                    </li>
                    <li>
                      You can choose to accept or decline cookies through your web browser. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline
                      cookies if you prefer. If you would prefer not to accept cookies, most browsers will allow you to: (i) change your browser settings to notify you when you receive a cookie, which
                      lets you choose whether or not to accept it; (ii) disable existing cookies; or (iii) set your browser to automatically reject any cookies. If you set your browser to reject
                      cookies, parts of our Services may not work for you.
                    </li>
                    <li>For more general information on cookies, please read &quot;What Are Cookies&quot;.</li>
                  </ul>
                </li>
                <li>
                  Analytics and advertising.
                  <ul>
                    <li>
                      To better understand how users engage with our Services, we use third-party analytics services that use cookies and similar technologies, including services provided by Google,
                      Mixpanel, and Hotjar. Please visit https://www.google.com/policies/privacy/partners/; https://mixpanel.com/legal/privacy-policy/; or
                      https://www.hotjar.com/legal/policies/privacy/; for more information about how these third parties collect and use data.
                    </li>
                    <li>
                      We may also use third-party advertising services to provide advertisements for our services. These third parties may collect information about your online activities over time
                      and across third-party websites, and they may be members of industry self-regulatory groups such as the Network Advertising Initiative (NAI), Digital Advertising Alliance (DAA),
                      and European Digital Advertising Alliance (eDAA). The websites for these groups provide more information on interest-based online advertising and how to opt out of receiving
                      interest-based online ads from participating companies.
                    </li>
                  </ul>
                </li>
                <li>
                  Do Not Track requests.
                  <ul>
                    <li>
                      Some browsers may transmit &quot;Do Not Track&quot; or &quot;DNT&quot; signals to the websites you visit. Because there is not common agreement about how to interpret DNT
                      signals, we do not take action in response to them.
                    </li>
                  </ul>
                </li>
                <li>
                  Location information.
                  <ul>
                    <li>
                      We may collect information about the location of your device, including precise geolocation information from your device and imprecise location from, for example, your IP
                      address.
                    </li>
                    <li>You may be able to adjust the location settings of your device to control whether it communicates location information. See your device settings for more information.</li>
                  </ul>
                </li>
                <li>
                  Purchase information and history.
                  <ul>
                    <li>We may collect information about your transactions with us.</li>
                  </ul>
                </li>
              </ul>
            </Typography>
            <Typography variant="h5">Information we receive from other sources</Typography>
            <Typography variant="body1">
              We may collect information from other sources, including from other users who might post information about you on our Services, or from business partners and service providers with whom
              we work. For example, another user may upload your name, e-mail address, photos, or other information in connection with a Memoryise created by that user.
            </Typography>

            <Typography variant="h4">How We Use The Information</Typography>
            <Typography variant="body1">
              We will not sell your information to data brokers or other third parties for money. We may use and process the types of information described above to:
              <ul>
                <li>
                  Provide our Services to you and other users. For example, a user may create a Memoryise and upload other individuals&apos; contact information so that those individuals may view
                  and/or contribute to the board. We may use that information to allow those individuals to view and/or contribute to the board or to contact one another regarding the board. Depending
                  on user choices, we may also send reminders to those individuals about the board. Users may also post photos of themselves or other individuals, and we may include those photos or
                  similar user-generated content within the users&apos; respective boards.
                </li>
                <li>
                  Maintain, protect, and improve our Services or other products. This may include, for example, customizing our Services to your preferences or interests, making them more compatible
                  with your technology, or otherwise making them easier to use; analyzing how they are used; and evaluating, maintaining, and improving their performance, effectiveness, security, and
                  safety.
                </li>
                <li>Process payments and transactions througsh a 3rd payment processor.</li>
                <li>
                  Communicate and manage our relationship with you. This may include, for example, providing you information about our Services or other products or services or about your transactions
                  with us; responding to your questions, inquiries, or requests; customizing and improving our communications with you and analyzing their effectiveness.
                </li>
                <li>Develop new applications or other products or services.</li>
                <li>
                  Promote our Services or other products. This may include, for example, developing and providing promotional and advertising materials about Memoryise that may be of interest to you;
                  analyzing the effectiveness of those materials; and customizing and improving them.
                </li>
                <li>
                  Address legal issues. This may include, for example, obtaining legal advice and establishing, exercising, or defending legal claims; complying with laws, regulatory requirements,
                  contractual obligations, court orders, other legal process or obligations, or lawful requests from public and government authorities; detecting, preventing, and responding to fraud,
                  intellectual property infringement, security issues, violations of our agreements, violations of law, or other misuse of our Services or other products or services; and protecting
                  the safety, rights, welfare, or property of Memoryise, you, or others.
                </li>
              </ul>
              We may also use your information for other internal Memoryise business operations, as permitted by applicable law, and other uses consistent with the context in which the information was
              collected or with your consent. We may anonymize or aggregate any of the information we collect and use it for any purpose, including for research and product-development purposes. Such
              aggregated information will not identify you individually or your organization.
            </Typography>

            <Typography variant="h4">How We Share The Information</Typography>
            <Typography variant="body1">
              We will not sell your information to data brokers or other third parties for money. We may, however, share your information as follows:
              <ul>
                <li>
                  In connection with our Services.
                  <ul>
                    <li>
                      The information that you or other users submit to us while using our Services may be seen by other visitors to our Services, potentially including the public. For example,
                      depending on the privacy settings of a Memoryise, users may share content from a board on social media.
                    </li>
                  </ul>
                </li>
                <li>
                  Service providers, vendors, and other business partners.
                  <ul>
                    <li>
                      We may share your information with third parties with whom we work to provide, improve, or develop our Services or other products; to perform other Website-related services; or
                      to assist us in analyzing how our Services or other products are used.
                    </li>
                    <li>
                      For example, we may work with vendors providing website hosting; data analysis; other technology services; payment processing; fraud monitoring; services related to product
                      development and maintenance; and communications, marketing, and online and offline advertising services.
                    </li>
                  </ul>
                </li>
                <li>
                  Legal reasons.
                  <ul>
                    <li>
                      We may share your information with third parties when we have a good faith belief that disclosure is necessary to: obtain legal advice or establish, exercise, or defend legal
                      claims; comply with laws, regulatory requirements, contractual obligations, court orders, or other legal process or obligations, or lawful requests from public and government
                      authorities; detect, prevent, or respond to fraud, intellectual property infringement, security issues, violations of our agreements or law, or other misuse of our Applications
                      or other products or services; protect the safety, rights, welfare, or property of Memoryise, you, or others, as required or permitted by applicable law.
                    </li>
                  </ul>
                </li>
                <li>
                  Business transfers.
                  <ul>
                    <li>
                      In the future, we may share your information with third parties in connection with any reorganization, merger, sale, joint venture, assignment, transfer, or other disposition of
                      all or any portion of our business, assets, or stock (including in connection with any bankruptcy or similar proceedings).
                    </li>
                  </ul>
                </li>
                <li>
                  Otherwise with your consent.
                  <ul>
                    <li>We may share your information with third parties when we have your consent to do so.</li>
                  </ul>
                </li>
                <li>
                  Anonymized or aggregated information.
                  <ul>
                    <li>
                      We may share anonymized or aggregated information internally and with third parties for any purpose. Such information will not identify you individually or your organization.
                    </li>
                  </ul>
                </li>
              </ul>
            </Typography>

            <Typography variant="h4">How You Can Manage Your Information</Typography>
            <Typography variant="body1">
              If you have an account with us, our Services allow you to:
              <ul>
                <li>Change the name associated with your account;</li>
                <li>Change the email associated with your account;</li>
                <li>Change the password associated with your account;</li>
                <li>Delete your account;</li>
                <li>
                  To delete your account data, click on &quot;Account&quot; and then &quot;Delete Account,&quot; located within the &quot;User Info&quot; tab. You will be asked to confirm the
                  deletion. If you decide to delete your account, please make sure you first save any information you would like to keep. Please also be aware that, even if you delete your account, we
                  might still maintain and process certain information about you, such as internet or other network or device activity, which may be necessary to provide our Services or to ensure
                  their security.
                </li>
              </ul>
              You may also contact us at info@memoryise.com to request the full deletion of your account data.
            </Typography>

            <Typography variant="h4">Where We Process Information</Typography>
            <Typography variant="body1">
              We may process your information in the United States and other locations around the world. The countries in which we process information may not provide the same level of protection for
              your information as your country. By using our Services or otherwise providing us your information, you acknowledge and understand that your information will be transferred to and
              processed in the United States and other countries.
            </Typography>

            <Typography variant="h4">EU Data Subject Rights</Typography>
            <Typography variant="body1">
              <ul>
                <li>If you are a natural person residing within the European Union, you have the following rights:</li>
                <li>The right to access. You have the right to request copies of your personal data.</li>
                <li>
                  The right to rectification. You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete information
                  you believe is incomplete.
                </li>
                <li>The right to erasure. You have the right to request that we erase your personal data, under certain conditions.</li>
                <li>The right to restrict processing. You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                <li>The right to object to processing. You have the right to object to our processing of your personal data, under certain conditions.</li>
                <li>
                  The right to data portability. You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.
                </li>
              </ul>
              If you would like to exercise any of these rights, please contact us at legal@memoryise.com. If you make a request, we will respond within the time required by law. In connection with
              such a request, we may require that you provide us with information necessary to confirm your identity before responding. In addition, please note that certain information may be exempt
              from such requests in some circumstances. For example, we may need to keep processing your information for our legitimate interests or to comply with a legal obligation.
            </Typography>

            <Typography variant="h4">California Consumer Rights</Typography>
            <Typography variant="body1">
              In this Statement, we have described the types of information we collect, the sources from which we collect the information, and the ways in which we use the information. For purposes of
              the California Consumer Privacy Act of 2018 (&quot;CCPA&quot;), the types of information we collect fall into the following categories:
              <ul>
                <li>Identifiers (e.g. name, mailing address, email address, phone number, credit/debit card number).</li>
                <li>Characteristics of protected classifications (e.g. gender, age).</li>
                <li>Commercial information (e.g. products or services purchased, purchase history).</li>
                <li>Internet or other electronic network activity (e.g. browser or search history).</li>
                <li>Geolocation data (e.g. latitude or longitude).</li>
                <li>Audio, electronic, visual, or similar information (e.g. recording of guest service calls).</li>
                <li>Professional or employment related information (e.g., occupation, job title, or professional association membership.</li>
                <li>Inferences drawn from any of the above (e.g. preferences or characteristics).</li>
              </ul>
              As described in this Statement, we collect this information from our consumers (through our Services or our customer or technical support services) and from our vendors and other service
              providers (including data analytics providers, advertising networks, and third-party account verification services), and we use this information for the business or commercial services
              described above. We do not sell your personal information to third parties, and we have not done so in the twelve months prior to the date of this Statement. We also do not share your
              personal information with third parties for their own direct marketing purposes. In addition, Memoryise does not have actual knowledge that it sells or discloses the personal information
              of minors under 16 years of age. To the extent that we become aware that such sale or disclosure might be occurring, we will take steps to prevent such events, and/or we will modify this
              Statement to describe those events and the related rights and choices of our consumers. If you are a California &quot;consumer,&quot; as defined by the CCPA, you may request that we:
              <ul>
                <li>Provide access to and/or a copy of certain personal information we have about you.</li>
                <li>
                  Provide information (up to twice in a 12-month period) about: the categories of personal information we collect, disclose, or sell about you; the categories of sources of such
                  information; the business or commercial purpose for collecting or selling your personal information; and the categories of third parties with whom we have shared personal information
                  during the past 12 months.
                </li>
                <li>Delete certain personal information we have about you.</li>
              </ul>
              You may exercise these rights by submitting a request to us at legal@Memoryise.com. In reviewing and responding to such requests, we will undertake reasonable efforts to verify your
              identity by, for example, matching any information you provide in the request with information we maintain. Please also note that most of these rights are not absolute, and our response
              may be limited as permitted by the CCPA. For example, the right to have personal information deleted is subject to a number of exceptions set out in the CCPA, such as when we need to
              maintain the information to provide products or services you requested or to comply with our legal obligations. Under the CCPA, California consumers also have the right not to receive
              discriminatory treatment for exercising their other rights. Memoryise will not discriminate against you because you exercise your rights. For example, Memoryise will not deny you goods
              or services or charge you a different price or rate for goods or services if you make an access, deletion, or do not sell request.
            </Typography>

            <Typography variant="h4">Data Security</Typography>
            <Typography variant="body1">
              We maintain technical and organizational security measures designed to help protect your personal information from unauthorized access, disclosure, alteration, or destruction.
              Unfortunately, no data transmission or storage system is 100% secure or error free, and we cannot guarantee the security of the information we collect.
            </Typography>

            <Typography variant="h4">Privacy Policy</Typography>
            <Typography variant="body1">
              We maintain technical and organizational security measures designed to help protect your personal information from unauthorized access, disclosure, alteration, or destruction.
              Unfortunately, no data transmission or storage system is 100% secure or error free, and we cannot guarantee the security of the information we collect.
            </Typography>

            <Typography variant="h4">Data Retention</Typography>
            <Typography variant="body1">
              We retain your information as long as necessary to fulfill the purposes outlined in this Statement, unless a longer retention period is required or allowed by law.
            </Typography>

            <Typography variant="h4">Links to Other Sites</Typography>
            <Typography variant="body1">
              Our Services may contain links to other sites, mobile applications, or third-party services, or plug-ins from social-media platforms or other third parties. Please note that these
              third-party sites and plug-ins are not operated by us. Therefore, we strongly advise you to review the third parties&apos; privacy policies. We have no control over and assume no
              responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </Typography>

            <Typography variant="h4">Children&apos;s Privacy</Typography>
            <Typography variant="body1">
              Our Services are not intended for anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child
              under 13 has provided us with personal information, we will delete such information from our servers. If you are a parent or guardian and you are aware that your child has provided us
              with personal information, please contact us.
            </Typography>

            <Typography variant="h4">Changes to This Privacy Statement</Typography>
            <Typography variant="body1">
              We may update our Privacy Statement from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy
              Statement on this page. Any changes to this Statement are effective immediately after they are posted on this page.
            </Typography>
          </Grid>
        </Grid>
      </Container>
      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Copyright sx={{ mt: 5 }} />
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}

export default PrivacyPage;
