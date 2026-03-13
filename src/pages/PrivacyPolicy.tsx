import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useMotion } from '../hooks/useMotion';

export default function PrivacyPolicy() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useMotion(containerRef);

  useGSAP(() => {
    gsap.fromTo(contentRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }, [lang]);

  useGSAP(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, { scope: containerRef });

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 sm:px-8 xl:px-0 relative z-0" ref={containerRef}>
      {/* Dynamic Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <div className="max-w-4xl mx-auto relative z-10" ref={contentRef}>
        
        {/* Header & Toggle */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12 border-b border-white/10 pb-8 relative">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-cyan-500/50"></div>
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded-sm border border-cyan-500/20">
                {lang === 'en' ? 'Legal Overview' : 'Resumen Legal'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-mono text-white tracking-tight uppercase">
              {lang === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
            </h1>
          </div>
          
          <div className="flex items-center bg-[#111111]/80 backdrop-blur-md p-1 rounded-sm border border-white/10 self-start md:self-auto shadow-lg">
            <button 
              onClick={() => setLang('en')}
              className={`px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-300 rounded-[2px] ${
                lang === 'en' 
                  ? 'bg-cyan-500 text-[#050505] font-bold shadow-[0_0_12px_rgba(34,211,238,0.4)]' 
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              English
            </button>
            <button 
              onClick={() => setLang('es')}
              className={`px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-300 rounded-[2px] ${
                lang === 'es' 
                  ? 'bg-cyan-500 text-[#050505] font-bold shadow-[0_0_12px_rgba(34,211,238,0.4)]' 
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Español
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-cyan max-w-none font-sans text-gray-400 
          prose-headings:font-mono prose-headings:text-white prose-headings:mt-12 prose-headings:mb-4
          prose-h2:text-2xl prose-h2:border-l-2 prose-h2:border-cyan-500/50 prose-h2:pl-4
          prose-h3:text-xl prose-h3:text-gray-200
          prose-h4:text-lg prose-h4:text-gray-300
          prose-p:leading-relaxed prose-p:mb-6
          prose-li:my-2 prose-ul:list-square prose-ul:pl-6
          prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300 hover:prose-a:underline
          prose-strong:text-gray-200 prose-strong:font-semibold">
          
          {lang === 'en' ? (
            <>
              <p>Last updated: March 13, 2026</p>
              <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
              <p>We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the <a href="https://www.termsfeed.com/privacy-policy-generator/" target="_blank" rel="noreferrer">Privacy Policy Generator</a>.</p>
              
              <h2>Interpretation and Definitions</h2>
              <h3>Interpretation</h3>
              <p>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
              
              <h3>Definitions</h3>
              <p>For the purposes of this Privacy Policy:</p>
              <ul>
              <li><p><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</p></li>
              <li><p><strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p></li>
              <li><p><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Privacy Policy) refers to Fermin.</p></li>
              <li><p><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</p></li>
              <li><p><strong>Country</strong> refers to: Costa Rica</p></li>
              <li><p><strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</p></li>
              <li>
                <p><strong>Personal Data</strong> (or "Personal Information") is any information that relates to an identified or identifiable individual.</p>
                <p>We use "Personal Data" and "Personal Information" interchangeably unless a law uses a specific term.</p>
              </li>
              <li><p><strong>Service</strong> refers to the Website.</p></li>
              <li><p><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</p></li>
              <li><p><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</p></li>
              <li><p><strong>Website</strong> refers to Fermin, accessible from <a href="https://www.ferminn.com/" rel="external nofollow noopener" target="_blank">https://www.ferminn.com/</a>.</p></li>
              <li><p><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p></li>
              </ul>
              
              <h2>Collecting and Using Your Personal Data</h2>
              <h3>Types of Data Collected</h3>
              <h4>Personal Data</h4>
              <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
              <ul>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li><strong>Automation & Integration Data:</strong> Data transmitted through webhooks, APIs, and automated workflows (including data processed via WhatsApp or other Meta services) necessary to execute the services You request.</li>
              </ul>
              
              <h4>Usage Data</h4>
              <p>Usage Data is collected automatically when using the Service.</p>
              <p>Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
              <p>When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device's unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p>
              <p>We may also collect information that Your browser sends whenever You visit Our Service or when You access the Service by or through a mobile device.</p>
              
              <h4>Tracking Technologies and Cookies</h4>
              <p>We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies We use include beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:</p>
              <ul>
              <li><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service.</li>
              <li><strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</li>
              </ul>
              <p>Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.</p>
              <p>Where required by law, we use non-essential cookies (such as analytics, advertising, and remarketing cookies) only with Your consent. You can withdraw or change Your consent at any time using Our cookie preferences tool (if available) or through Your browser/device settings. Withdrawing consent does not affect the lawfulness of processing based on consent before its withdrawal.</p>
              <p>We use both Session and Persistent Cookies for the purposes set out below:</p>
              <ul>
              <li>
              <p><strong>Necessary / Essential Cookies</strong></p>
              <p>Type: Session Cookies</p>
              <p>Administered by: Us</p>
              <p>Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</p>
              </li>
              <li>
              <p><strong>Cookies Policy / Notice Acceptance Cookies</strong></p>
              <p>Type: Persistent Cookies</p>
              <p>Administered by: Us</p>
              <p>Purpose: These Cookies identify if users have accepted the use of cookies on the Website.</p>
              </li>
              <li>
              <p><strong>Functionality Cookies</strong></p>
              <p>Type: Persistent Cookies</p>
              <p>Administered by: Us</p>
              <p>Purpose: These Cookies allow Us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</p>
              </li>
              </ul>
              <p>For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of Our Privacy Policy.</p>
              
              <h3>Use of Your Personal Data</h3>
              <p>The Company may use Personal Data for the following purposes:</p>
              <ul>
              <li><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
              <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</li>
              <li><strong>To provide automation services:</strong> To create, manage, and monitor automated workflows (e.g., via n8n) and facilitate communications through third-party APIs, including the WhatsApp Business API and other Meta Platforms.</li>
              <li><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
              <li><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
              <li><strong>To provide You</strong> with news, special offers, and general information about other goods, services and events which We offer that are similar to those that you have already purchased or inquired about unless You have opted not to receive such information.</li>
              <li><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
              <li><strong>For business transfers:</strong> We may use Your Personal Data to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</li>
              <li><strong>For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</li>
              </ul>
              
              <p>We may share Your Personal Data in the following situations:</p>
              <ul>
              <li><strong>With Service Providers:</strong> We may share Your Personal Data with Service Providers to monitor and analyze the use of our Service, to contact You.</li>
              <li><strong>For business transfers:</strong> We may share or transfer Your Personal Data in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.</li>
              <li><strong>With Affiliates:</strong> We may share Your Personal Data with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.</li>
              <li><strong>With business partners:</strong> We may share Your Personal Data with Our business partners to offer You certain products, services or promotions.</li>
              <li><strong>With other users:</strong> If Our Service offers public areas, when You share Personal Data or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.</li>
              <li><strong>With Your consent</strong>: We may disclose Your Personal Data for any other purpose with Your consent.</li>
              </ul>
              
              <h3>Retention of Your Personal Data</h3>
              <p>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if We are required to retain Your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p>
              <p>Where possible, We apply shorter retention periods and/or reduce identifiability by deleting, aggregating, or anonymizing data. Unless otherwise stated, the retention periods below are maximum periods ("up to") and We may delete or anonymize data sooner when it is no longer needed for the relevant purpose. We apply different retention periods to different categories of Personal Data based on the purpose of processing and legal obligations:</p>
              <ul>
              <li>
              <p>Account Information</p>
              <ul>
              <li>User Accounts: retained for the duration of your account relationship plus up to 24 months after account closure to handle any post-termination issues or resolve disputes.</li>
              </ul>
              </li>
              <li>
              <p>Customer Support Data</p>
              <ul>
              <li>Support tickets and correspondence: up to 24 months from the date of ticket closure to resolve follow-up inquiries, track service quality, and defend against potential legal claims</li>
              <li>Chat transcripts: up to 24 months for quality assurance and staff training purposes.</li>
              </ul>
              </li>
              <li>
              <p>Usage Data</p>
              <ul>
              <li>Website analytics data (cookies, IP addresses, device identifiers): up to 24 months from the date of collection, which allows us to analyze trends while respecting privacy principles.</li>
              <li>Server logs (IP addresses, access times): up to 24 months for security monitoring and troubleshooting purposes.</li>
              </ul>
              </li>
              </ul>
              <p>Usage Data is retained in accordance with the retention periods described above, and may be retained longer only where necessary for security, fraud prevention, or legal compliance.</p>
              <p>We may retain Personal Data beyond the periods stated above for different reasons:</p>
              <ul>
              <li>Legal obligation: We are required by law to retain specific data (e.g., financial records for tax authorities).</li>
              <li>Legal claims: Data is necessary to establish, exercise, or defend legal claims.</li>
              <li>Your explicit request: You ask Us to retain specific information.</li>
              <li>Technical limitations: Data exists in backup systems that are scheduled for routine deletion.</li>
              </ul>
              <p>You may request information about how long We will retain Your Personal Data by contacting Us.</p>
              <p>When retention periods expire, We securely delete or anonymize Personal Data according to the following procedures:</p>
              <ul>
              <li>Deletion: Personal Data is removed from Our systems and no longer actively processed.</li>
              <li>Backup retention: Residual copies may remain in encrypted backups for a limited period consistent with our backup retention schedule and are not restored except where necessary for security, disaster recovery, or legal compliance.</li>
              <li>Anonymization: In some cases, We convert Personal Data into anonymous statistical data that cannot be linked back to You. This anonymized data may be retained indefinitely for research and analytics.</li>
              </ul>
              
              <h3>Transfer of Your Personal Data</h3>
              <p>Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from Your jurisdiction.</p>
              <p>Where required by applicable law, We will ensure that international transfers of Your Personal Data are subject to appropriate safeguards and supplementary measures where appropriate. The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.</p>
              
              <h3>Delete Your Personal Data</h3>
              <p>You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.</p>
              <p>Our Service may give You the ability to delete certain information about You from within the Service.</p>
              <p>You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any Personal Data that You have provided to Us.</p>
              <p>Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.</p>
              
              <h4>Data Deletion Instructions (Meta Compliance)</h4>
              <p>If You use our automation services integrated with Meta Platforms (such as Facebook or WhatsApp) and wish to have Your data completely removed from our systems and linked Meta applications, You have the right to request full data deletion.</p>
              <p>To request the deletion of Your data, please follow these steps:</p>
              <ol className="list-decimal pl-6 my-4">
              <li className="my-2">Send an email to <strong>fezgar12@gmail.com</strong> with the subject line "Data Deletion Request".</li>
              <li className="my-2">Include the specific email address or phone number associated with the automated services.</li>
              <li className="my-2">We will process Your request and permanently delete Your data from our active databases and workflow engines within 7 business days, notifying You once complete.</li>
              </ol>
              
              <h3>Disclosure of Your Personal Data</h3>
              <h4>Business Transactions</h4>
              <p>If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>
              <h4>Law enforcement</h4>
              <p>Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>
              <h4>Other legal requirements</h4>
              <p>The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:</p>
              <ul>
              <li>Comply with a legal obligation</li>
              <li>Protect and defend the rights or property of the Company</li>
              <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
              <li>Protect the personal safety of Users of the Service or the public</li>
              <li>Protect against legal liability</li>
              </ul>
              
              <h3>Security of Your Personal Data</h3>
              <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially reasonable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
              
              <h2>Children's Privacy</h2>
              <p>Our Service does not address anyone under the age of 16. We do not knowingly collect personally identifiable information from anyone under the age of 16. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 16 without verification of parental consent, We take steps to remove that information from Our servers.</p>
              <p>If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.</p>
              
              <h2>Links to Other Websites</h2>
              <p>Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.</p>
              <p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>
              
              <h2>Changes to this Privacy Policy</h2>
              <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
              <p>We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.</p>
              <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
              
              <h2>Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, You can contact us:</p>
              <ul>
              <li><p>By email: fezgar12@gmail.com</p></li>
              <li><p>By visiting this page on our website: <a href="https://www.ferminn.com/" rel="external nofollow noopener" target="_blank">https://www.ferminn.com/</a></p></li>
              <li><p>By phone: +50687088364</p></li>
              </ul>
            </>
          ) : (
            <>
              <p>Última actualización: 13 de marzo de 2026</p>
              <p>Esta Política de Privacidad describe Nuestras políticas y procedimientos sobre la recopilación, uso y divulgación de Su información cuando utiliza el Servicio, y le informa sobre Sus derechos de privacidad y cómo la ley le protege.</p>
              <p>Utilizamos Sus Datos Personales para proporcionar y mejorar el Servicio. Al utilizar el Servicio, Usted acepta la recopilación y el uso de información de acuerdo con esta Política de Privacidad. Esta Política de Privacidad ha sido creada con la ayuda del <a href="https://www.termsfeed.com/privacy-policy-generator/" target="_blank" rel="noreferrer">Generador de Políticas de Privacidad</a>.</p>
              
              <h2>Interpretación y Definiciones</h2>
              <h3>Interpretación</h3>
              <p>Las palabras cuyas letras iniciales están en mayúscula tienen significados definidos bajo las siguientes condiciones. Las siguientes definiciones tendrán el mismo significado independientemente de si aparecen en singular o en plural.</p>
              
              <h3>Definiciones</h3>
              <p>Para los fines de esta Política de Privacidad:</p>
              <ul>
              <li><p><strong>Cuenta</strong> significa una cuenta única creada para Usted con el fin de acceder a nuestro Servicio o partes de nuestro Servicio.</p></li>
              <li><p><strong>Afiliado</strong> significa una entidad que controla, es controlada por, o está bajo control común con una parte, donde "control" significa la propiedad del 50% o más de las acciones, intereses de capital u otros valores con derecho a voto para la elección de directores u otra autoridad administrativa.</p></li>
              <li><p><strong>Compañía</strong> (referida como "la Compañía", "Nosotros", "Nos" o "Nuestro" en esta Política de Privacidad) se refiere a Fermin.</p></li>
              <li><p><strong>Cookies</strong> son pequeños archivos que un sitio web coloca en Su computadora, dispositivo móvil o cualquier otro dispositivo, y que contienen detalles de Su historial de navegación en ese sitio web, entre sus muchos usos.</p></li>
              <li><p><strong>País</strong> se refiere a: Costa Rica</p></li>
              <li><p><strong>Dispositivo</strong> significa cualquier dispositivo que pueda acceder al Servicio, como una computadora, un teléfono celular o una tableta digital.</p></li>
              <li>
                <p><strong>Datos Personales</strong> (o "Información Personal") es cualquier información que se relacione con un individuo identificado o identificable.</p>
                <p>Utilizamos "Datos Personales" e "Información Personal" indistintamente a menos que una ley exija el uso de un término específico.</p>
              </li>
              <li><p><strong>Servicio</strong> se refiere al Sitio Web.</p></li>
              <li><p><strong>Proveedor de Servicios</strong> significa cualquier persona física o jurídica que procesa los datos en nombre de la Compañía. Se refiere a empresas o terceros empleados por la Compañía para facilitar el Servicio, para proporcionar el Servicio en nombre de la Compañía, para realizar servicios relacionados con el Servicio o para ayudar a la Compañía a analizar cómo se utiliza el Servicio.</p></li>
              <li><p><strong>Datos de Uso</strong> se refiere a los datos recopilados automáticamente, ya sea generados por el uso del Servicio o desde la propia infraestructura del Servicio (por ejemplo, la duración de la visita a una página).</p></li>
              <li><p><strong>Sitio Web</strong> se refiere a Fermin, accesible desde <a href="https://www.ferminn.com/" rel="external nofollow noopener" target="_blank">https://www.ferminn.com/</a>.</p></li>
              <li><p><strong>Usted</strong> significa el individuo que accede o utiliza el Servicio, o la empresa, u otra entidad legal en nombre de la cual dicho individuo accede o utiliza el Servicio, según corresponda.</p></li>
              </ul>
              
              <h2>Recopilación y Uso de Sus Datos Personales</h2>
              <h3>Tipos de Datos Recopilados</h3>
              <h4>Datos Personales</h4>
              <p>Al utilizar Nuestro Servicio, es posible que le solicitemos que Nos proporcione cierta información de identificación personal que se puede utilizar para contactarlo o identificarlo. La información de identificación personal puede incluir, pero no se limita a:</p>
              <ul>
              <li>Dirección de correo electrónico</li>
              <li>Nombre y apellidos</li>
              <li>Número de teléfono</li>
              <li><strong>Datos de Automatización e Integración:</strong> Datos transmitidos a través de webhooks, API y flujos de trabajo automatizados (incluyendo los datos procesados a través de WhatsApp u otros servicios de Meta) necesarios para ejecutar los servicios que Usted solicita.</li>
              </ul>
              
              <h4>Datos de Uso</h4>
              <p>Los Datos de Uso se recopilan automáticamente al utilizar el Servicio.</p>
              <p>Los Datos de Uso pueden incluir información como la dirección de Protocolo de Internet de Su Dispositivo (por ejemplo, dirección IP), el tipo de navegador, la versión del navegador, las páginas de nuestro Servicio que Usted visita, la hora y fecha de Su visita, el tiempo dedicado a esas páginas, identificadores únicos del dispositivo y otros datos de diagnóstico.</p>
              <p>Cuando Usted accede al Servicio por o a través de un dispositivo móvil, podemos recopilar cierta información automáticamente, que incluye, entre otros, el tipo de dispositivo móvil que utiliza, el ID único de su dispositivo móvil, la dirección IP de su dispositivo móvil, Su sistema operativo móvil, el tipo de navegador de Internet móvil que utiliza, identificadores únicos del dispositivo y otros datos de diagnóstico.</p>
              <p>También podemos recopilar información que Su navegador envía cada vez que Usted visita Nuestro Servicio o cuando accede al Servicio por o a través de un dispositivo móvil.</p>
              
              <h4>Tecnologías de Rastreo y Cookies</h4>
              <p>Utilizamos Cookies y tecnologías de rastreo similares para rastrear la actividad en Nuestro Servicio y almacenar cierta información. Las tecnologías de rastreo que utilizamos incluyen balizas (beacons), etiquetas y scripts para recopilar y rastrear información, así como para mejorar y analizar Nuestro Servicio. Las tecnologías que utilizamos pueden incluir:</p>
              <ul>
              <li><strong>Cookies o Cookies del Navegador.</strong> Una cookie es un pequeño archivo que se coloca en Su Dispositivo. Usted puede indicar a Su navegador que rechace todas las Cookies o que le avise cuando se envía una Cookie. Sin embargo, si Usted no acepta las Cookies, es posible que no pueda utilizar algunas partes de nuestro Servicio.</li>
              <li><strong>Balizas Web (Web Beacons).</strong> Ciertas secciones de nuestro Servicio y nuestros correos electrónicos pueden contener pequeños archivos electrónicos conocidos como balizas web (también referidos como gifs transparentes, etiquetas de píxel y gifs de un solo píxel) que permiten a la Compañía, por ejemplo, contar los usuarios que han visitado esas páginas o abierto un correo electrónico y para otras estadísticas relacionadas con el sitio web (por ejemplo, registrar la popularidad de una sección determinada y verificar la integridad del sistema y del servidor).</li>
              </ul>
              <p>Las Cookies pueden ser "Persistentes" o de "Sesión". Las Cookies Persistentes permanecen en Su computadora personal o dispositivo móvil cuando Usted se desconecta, mientras que las Cookies de Sesión se eliminan tan pronto como Usted cierra Su navegador web.</p>
              <p>Cuando la ley lo exija, utilizaremos cookies no esenciales (como cookies de análisis, publicidad y remarketing) únicamente con Su consentimiento. Usted puede retirar o modificar Su consentimiento en cualquier momento utilizando Nuestra herramienta de preferencias de cookies (si está disponible) o a través de la configuración de Su navegador/dispositivo. La retirada del consentimiento no afecta la legalidad del procesamiento basado en el consentimiento previo a su retiro.</p>
              <p>Utilizamos tanto Cookies de Sesión como Persistentes para los fines establecidos a continuación:</p>
              <ul>
              <li>
              <p><strong>Cookies Necesarias / Esenciales</strong></p>
              <p>Tipo: Cookies de Sesión</p>
              <p>Administrado por: Nosotros</p>
              <p>Propósito: Estas Cookies son esenciales para proporcionarle los servicios disponibles a través del Sitio Web y para permitirle usar algunas de sus funciones. Ayudan a autenticar a los usuarios y prevenir el uso fraudulento de las cuentas de usuario. Sin estas Cookies, los servicios que Usted ha solicitado no pueden ser proporcionados, y solo utilizamos estas Cookies para brindarle esos servicios.</p>
              </li>
              <li>
              <p><strong>Cookies de Aceptación de la Política de Cookies / Avisos</strong></p>
              <p>Tipo: Cookies Persistentes</p>
              <p>Administrado por: Nosotros</p>
              <p>Propósito: Estas Cookies identifican si los usuarios han aceptado el uso de cookies en el Sitio Web.</p>
              </li>
              <li>
              <p><strong>Cookies de Funcionalidad</strong></p>
              <p>Tipo: Cookies Persistentes</p>
              <p>Administrado por: Nosotros</p>
              <p>Propósito: Estas Cookies nos permiten recordar las elecciones que Usted realiza al usar el Sitio Web, como recordar los detalles de inicio de sesión o sus preferencias de idioma. El propósito de estas Cookies es proporcionarle una experiencia más personal y evitar que Usted deba volver a ingresar sus preferencias cada vez que utiliza el Sitio Web.</p>
              </li>
              </ul>
              <p>Para obtener más información sobre las cookies que utilizamos y sus opciones con respecto a las cookies, por favor visite nuestra Política de Cookies o la sección de Cookies de Nuestra Política de Privacidad.</p>
              
              <h3>Uso de Sus Datos Personales</h3>
              <p>La Compañía puede utilizar Sus Datos Personales para los siguientes fines:</p>
              <ul>
              <li><strong>Para proporcionar y mantener nuestro Servicio</strong>, lo que incluye monitorear el uso de nuestro Servicio.</li>
              <li><strong>Para gestionar Su Cuenta:</strong> para gestionar Su registro como usuario del Servicio. Los Datos Personales que Usted proporcione pueden darle acceso a diferentes funcionalidades del Servicio que están disponibles para Usted como usuario registrado.</li>
              <li><strong>Para proporcionar servicios de automatización:</strong> Para crear, gestionar y monitorear flujos de trabajo automatizados (por ejemplo, a través de n8n) y facilitar las comunicaciones mediante API de terceros, incluyendo la API de WhatsApp Business y otras Plataformas de Meta.</li>
              <li><strong>Para el cumplimiento de un contrato:</strong> el desarrollo, cumplimiento e inicio del contrato de compra de los productos, artículos o servicios que Usted haya adquirido, o de cualquier otro contrato con Nosotros a través del Servicio.</li>
              <li><strong>Para comunicarnos con Usted:</strong> Para contactarlo por correo electrónico, llamadas telefónicas, SMS u otras formas equivalentes de comunicación electrónica, tales como las notificaciones push de una aplicación móvil con respecto a las actualizaciones o comunicaciones informativas relacionadas con las funcionalidades, productos o servicios contratados, incluyendo actualizaciones de seguridad, cuando sea necesario o razonable para su implementación.</li>
              <li><strong>Para proporcionarle</strong> noticias, ofertas especiales e información general sobre otros bienes, servicios y eventos que ofrecemos, y que son similares a aquellos que Usted ya ha comprado o por los que ha consultado, a menos que haya optado por no recibir dicha información.</li>
              <li><strong>Para gestionar sus solicitudes:</strong> Para atender y administrar las solicitudes que Nos hace llegar.</li>
              <li><strong>Para transferencias de negocios:</strong> Podemos usar Sus Datos Personales para evaluar o llevar a cabo una fusión, desinversión, reestructuración, reorganización, disolución u otra venta o transferencia de algunos o todos Nuestros activos, ya sea como una empresa en marcha o como parte de un proceso de bancarrota, liquidación o procedimiento similar, en el cual los Datos Personales que poseemos sobre los usuarios de nuestro Servicio se encuentren entre los activos transferidos.</li>
              <li><strong>Para otros fines</strong>: Podemos usar Su información para otros fines, tales como análisis de datos, identificación de tendencias de uso, para determinar la eficacia de nuestras campañas promocionales, y para evaluar y mejorar nuestro Servicio, productos, servicios, marketing y su experiencia.</li>
              </ul>
              
              <p>Podemos compartir Sus Datos Personales en las siguientes situaciones:</p>
              <ul>
              <li><strong>Con Proveedores de Servicios:</strong> Podemos compartir Sus Datos Personales con Proveedores de Servicios para monitorear y analizar el uso de nuestro Servicio, y para contactarlo a Usted.</li>
              <li><strong>Para transferencias de negocios:</strong> Podemos compartir o transferir Sus Datos Personales en relación con, o durante las negociaciones de, cualquier fusión, venta de activos de la Compañía, financiación o adquisición de todo o una parte de Nuestro negocio a otra compañía.</li>
              <li><strong>Con Afiliados:</strong> Podemos compartir Sus Datos Personales con Nuestros afiliados, en cuyo caso requeriremos que dichos afiliados cumplan con esta Política de Privacidad. Los afiliados incluyen a Nuestra empresa matriz y cualquier otra subsidiaria, socios de empresas conjuntas u otras compañías que controlemos o que estén bajo control común con Nosotros.</li>
              <li><strong>Con socios comerciales:</strong> Podemos compartir Sus Datos Personales con Nuestros socios comerciales para ofrecerle ciertos productos, servicios o promociones.</li>
              <li><strong>Con otros usuarios:</strong> Si Nuestro Servicio ofrece áreas públicas, cuando Usted comparte Datos Personales o interactúa de otra forma en las áreas públicas con otros usuarios, dicha información puede ser vista por todos los usuarios y distribuirse públicamente fuera del portal.</li>
              <li><strong>Con Su consentimiento</strong>: Podemos divulgar Sus Datos Personales para cualquier otro propósito con Su consentimiento.</li>
              </ul>
              
              <h3>Retención de Sus Datos Personales</h3>
              <p>La Compañía retendrá Sus Datos Personales solo durante el tiempo que sea necesario para los fines establecidos en esta Política de Privacidad. Retendremos y utilizaremos Sus Datos Personales en la medida que sea necesario para cumplir con nuestras obligaciones legales (por ejemplo, si se nos requiere retener Sus datos para cumplir con las leyes aplicables), resolver disputas y hacer cumplir nuestros acuerdos y políticas legales.</p>
              <p>Siempre que sea posible, aplicamos períodos de retención más cortos y/o reducimos la capacidad de identificación mediante la eliminación, agregación o anonimización de datos. A menos que se indique lo contrario, los períodos de retención mostrados a continuación son máximos ("hasta") y podemos eliminar o anonimizar los datos antes, cuando ya no sean necesarios para el propósito pertinente. Aplicamos distintos períodos de retención a diferentes categorías de Datos Personales en función del propósito del procesamiento y las obligaciones legales:</p>
              <ul>
              <li>
              <p>Información de la Cuenta</p>
              <ul>
              <li>Cuentas de usuario: se retienen durante toda la duración de su relación con la cuenta más hasta 24 meses después de su cierre para atender cualquier asunto posterior o resolver disputas.</li>
              </ul>
              </li>
              <li>
              <p>Datos de Soporte al Cliente</p>
              <ul>
              <li>Tickets de soporte y correspondencia: hasta 24 meses desde la fecha de cierre del ticket para resolver consultas posteriores, rastrear la calidad del servicio y defendernos contra posibles reclamos legales.</li>
              <li>Transcripciones de chat: hasta 24 meses para propósitos de control de calidad y capacitación del personal.</li>
              </ul>
              </li>
              <li>
              <p>Datos de Uso</p>
              <ul>
              <li>Datos analíticos del sitio web (cookies, direcciones IP, identificadores de dispositivo): hasta 24 meses desde la fecha de recolección, lo que nos permite analizar tendencias manteniendo el respeto por los principios de privacidad.</li>
              <li>Registros del servidor (direcciones IP, tiempos de acceso): hasta 24 meses para monitoreo de seguridad y resolución de problemas.</li>
              </ul>
              </li>
              </ul>
              <p>Los Datos de Uso se retienen de acuerdo con los períodos de retención descritos anteriormente, y pueden retenerse por más tiempo únicamente cuando sea necesario para la seguridad, prevención de fraudes, o por cumplimiento legal.</p>
              <p>Podemos retener Datos Personales más allá de los períodos indicados anteriormente por diferentes razones:</p>
              <ul>
              <li>Obligación legal: Estamos requeridos por ley a retener datos específicos (por ejemplo, registros financieros para autoridades fiscales).</li>
              <li>Reclamos legales: Los datos son necesarios para establecer, ejercer o defender reclamos legales.</li>
              <li>Su solicitud explícita: Usted Nos pide retener información específica.</li>
              <li>Limitaciones técnicas: Los datos existen en sistemas de respaldo programados para su eliminación rutinaria.</li>
              </ul>
              <p>Usted puede solicitar información sobre cuánto tiempo retendremos Sus Datos Personales comunicándose con Nosotros.</p>
              <p>Cuando expiran los períodos de retención, Nosotros eliminamos de forma segura o anonimizamos los Datos Personales según los siguientes procedimientos:</p>
              <ul>
              <li>Eliminación: Los Datos Personales son eliminados de Nuestros sistemas y ya no se procesan activamente.</li>
              <li>Retención de respaldos: Las copias residuales pueden permanecer en copias de seguridad encriptadas por un período limitado consistente con nuestro calendario de retención de respaldos y no son restauradas excepto cuando es necesario para la seguridad, recuperación de desastres, o cumplimiento legal.</li>
              <li>Anonimización: En algunos casos, convertimos los Datos Personales en datos estadísticos anónimos que no pueden ser vinculados a Usted. Estos datos anonimizados pueden retenerse indefinidamente para fines de investigación y análisis.</li>
              </ul>
              
              <h3>Transferencia de Sus Datos Personales</h3>
              <p>Su información, incluidos los Datos Personales, se procesa en las oficinas operativas de la Compañía y en cualquier otro lugar donde se encuentren las partes involucradas en el procesamiento. Esto significa que esta información puede transferirse y mantenerse en computadoras ubicadas fuera de Su estado, provincia, país u otra jurisdicción gubernamental donde las leyes de protección de datos pueden diferir de las de Su jurisdicción.</p>
              <p>Cuando lo requiera la ley aplicable, Nos aseguraremos de que las transferencias internacionales de Sus Datos Personales estén sujetas a las garantías adecuadas y a las medidas complementarias necesarias. La Compañía tomará todas las medidas razonablemente necesarias para garantizar que Sus datos sean tratados de manera segura y de acuerdo con esta Política de Privacidad, y no se realizará ninguna transferencia de Sus Datos Personales a una organización o país a menos que existan controles adecuados, incluida la seguridad de Sus datos y otra información personal.</p>
              
              <h3>Eliminación de Sus Datos Personales</h3>
              <p>Usted tiene el derecho de eliminar o solicitar que le ayudemos a eliminar los Datos Personales que hemos recopilado sobre Usted.</p>
              <p>Nuestro Servicio puede brindarle la capacidad de eliminar cierta información sobre Usted desde el mismo Servicio.</p>
              <p>Usted puede actualizar, enmendar o eliminar Su información en cualquier momento mediante el inicio de sesión en Su Cuenta, si tiene una, y visitando la sección de configuración de la cuenta que le permite administrar Su información personal. También puede contactarnos para solicitar el acceso a, corregir, o eliminar cualquier Dato Personal que nos haya proporcionado.</p>
              <p>Tenga en cuenta, sin embargo, que es posible que necesitemos retener cierta información cuando tengamos una obligación legal o una base legal para hacerlo.</p>
              
              <h4>Instrucciones para la Eliminación de Datos (Cumplimiento de Meta)</h4>
              <p>Si Usted utiliza nuestros servicios de automatización integrados con las Plataformas de Meta (como Facebook o WhatsApp) y desea que se eliminen por completo Sus datos de nuestros sistemas y aplicaciones de Meta vinculadas, Usted tiene el derecho a solicitar la eliminación total de sus datos.</p>
              <p>Para solicitar la eliminación de Sus datos, por favor siga estos pasos:</p>
              <ol className="list-decimal pl-6 my-4">
              <li className="my-2">Envíe un correo electrónico a <strong>fezgar12@gmail.com</strong> con el asunto "Solicitud de Eliminación de Datos" (Data Deletion Request).</li>
              <li className="my-2">Incluya la dirección de correo electrónico específica o el número de teléfono asociado con los servicios automatizados.</li>
              <li className="my-2">Procesaremos Su solicitud y eliminaremos de forma permanente Sus datos de nuestras bases de datos activas y motores de flujo de trabajo en un plazo de 7 días hábiles, notificándole una vez que se haya completado.</li>
              </ol>
              
              <h3>Divulgación de Sus Datos Personales</h3>
              <h4>Transacciones Comerciales</h4>
              <p>Si la Compañía participa en una fusión, adquisición o venta de activos, Sus Datos Personales pueden ser transferidos. Proporcionaremos un aviso antes de que Sus Datos Personales sean transferidos y queden sujetos a una Política de Privacidad diferente.</p>
              <h4>Cumplimiento de la Ley</h4>
              <p>En determinadas circunstancias, la Compañía puede estar obligada a divulgar Sus Datos Personales si así lo exige la ley o en respuesta a solicitudes válidas de autoridades públicas (por ejemplo, un tribunal o una agencia gubernamental).</p>
              <h4>Otros Requisitos Legales</h4>
              <p>La Compañía puede divulgar Sus Datos Personales de buena fe cuando considere que dicha acción es necesaria para:</p>
              <ul>
              <li>Cumplir con una obligación legal</li>
              <li>Proteger y defender los derechos o la propiedad de la Compañía</li>
              <li>Prevenir o investigar posibles irregularidades en relación con el Servicio</li>
              <li>Proteger la seguridad personal de los Usuarios del Servicio o del público</li>
              <li>Protegerse contra la responsabilidad legal</li>
              </ul>
              
              <h3>Seguridad de Sus Datos Personales</h3>
              <p>La seguridad de Sus Datos Personales es importante para Nosotros, pero recuerde que ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro. Si bien nos esforzamos por usar medios comercialmente aceptables para proteger Sus Datos Personales, no podemos garantizar Su seguridad absoluta.</p>
              
              <h2>Privacidad de los Niños</h2>
              <p>Nuestro Servicio no está dirigido a menores de 16 años. No recopilamos conscientemente información de identificación personal de personas menores de 16 años. Si Usted es padre o tutor y sabe que su hijo Nos ha proporcionado Datos Personales, por favor contáctenos. Si Nos damos cuenta de que hemos recopilado Datos Personales de un menor de 16 años sin la verificación del consentimiento de los padres, tomamos las medidas necesarias para eliminar esa información de Nuestros servidores.</p>
              <p>Si necesitamos basarnos en el consentimiento como base legal para procesar Su información y Su país requiere el consentimiento de un padre, es posible que solicitemos el consentimiento de Su padre o tutor antes de recopilar y usar dicha información.</p>
              
              <h2>Enlaces a Otros Sitios Web</h2>
              <p>Nuestro Servicio puede contener enlaces a otros sitios web que no son operados por Nosotros. Si Usted hace clic en un enlace de un tercero, será dirigido al sitio de ese tercero. Le recomendamos encarecidamente que revise la Política de Privacidad de cada sitio web que visite.</p>
              <p>No tenemos control sobre, ni asumimos ninguna responsabilidad por el contenido, las políticas de privacidad o las prácticas de cualquier sitio o servicio de terceros.</p>
              
              <h2>Cambios a esta Política de Privacidad</h2>
              <p>Podemos actualizar Nuestra Política de Privacidad de vez en cuando. Le notificaremos sobre cualquier cambio mediante la publicación de la nueva Política de Privacidad en esta página.</p>
              <p>Le informaremos a través del correo electrónico y/o mediante un aviso destacado en Nuestro Servicio, antes de que el cambio entre en vigor, y actualizaremos la fecha de "Última actualización" en la parte superior de esta Política de Privacidad.</p>
              <p>Se le aconseea revisar periódicamente esta Política de Privacidad para ver si hay algún cambio. Los cambios a esta Política de Privacidad son efectivos cuando se publican en esta página.</p>
              
              <h2>Contáctenos</h2>
              <p>Si tiene alguna pregunta sobre esta Política de Privacidad, puede comunicarse con nosotros:</p>
              <ul>
              <li><p>Por correo electrónico: fezgar12@gmail.com</p></li>
              <li><p>Visitando esta página en nuestro sitio web: <a href="https://www.ferminn.com/" rel="external nofollow noopener" target="_blank">https://www.ferminn.com/</a></p></li>
              <li><p>Por teléfono: +50687088364</p></li>
              </ul>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
