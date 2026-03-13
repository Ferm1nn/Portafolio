import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useMotion } from '../hooks/useMotion';

export default function TermsOfService() {
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
              {lang === 'en' ? 'Terms of Service' : 'Términos de Servicio'}
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
              <p>Please read these Terms of Service carefully before using our Website operated by Fermin.</p>
              
              <h2>1. Agreement to Terms</h2>
              <p>By accessing or using our Service (the Website), You agree to be bound by these Terms. If You disagree with any part of the terms then You may not access the Service.</p>

              <h2>2. Intellectual Property</h2>
              <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Fermin and its licensors. The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.</p>

              <h2>3. Links to Other Web Sites</h2>
              <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by Fermin.</p>
              <p>Fermin has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that Fermin shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>

              <h2>4. Termination</h2>
              <p>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach the Terms.</p>
              <p>Upon termination, Your right to use the Service will immediately cease.</p>

              <h2>5. Limitation of Liability</h2>
              <p>In no event shall Fermin, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) Your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of Your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not We have been informed of the possibility of such damage.</p>

              <h2>6. Disclaimer</h2>
              <p>Your use of the Service is at Your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.</p>

              <h2>7. Governing Law</h2>
              <p>These Terms shall be governed and construed in accordance with the laws of Costa Rica, without regard to its conflict of law provisions.</p>
              <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.</p>

              <h2>8. Changes</h2>
              <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.</p>
              <p>By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, please stop using the Service.</p>

              <h2>9. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us:</p>
              <ul>
              <li><p>By email: fezgar12@gmail.com</p></li>
              <li><p>By phone: +50687088364</p></li>
              </ul>
            </>
          ) : (
            <>
              <p>Última actualización: 13 de marzo de 2026</p>
              <p>Por favor, lea estos Términos de Servicio detenidamente antes de utilizar nuestro Sitio Web operado por Fermin.</p>
              
              <h2>1. Acuerdo de los Términos</h2>
              <p>Al acceder o utilizar nuestro Servicio (el Sitio Web), Usted acepta estar legalmente sujeto a estos Términos. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.</p>

              <h2>2. Propiedad Intelectual</h2>
              <p>El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Fermin y sus licenciantes. El Servicio está protegido por derechos de autor, marcas comerciales y otras leyes tanto del País como de países extranjeros.</p>

              <h2>3. Enlaces a Otros Sitios Web</h2>
              <p>Nuestro Servicio puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni están controlados por Fermin.</p>
              <p>Fermin no tiene control sobre, y no asume ninguna responsabilidad por, el contenido, las políticas de privacidad o las prácticas de sitios web o servicios de terceros. Usted reconoce y acepta además que Fermin no será responsable, directa o indirectamente, de ningún daño o pérdida causada o supuestamente causada por o en conexión con el uso o la confianza en dicho contenido, bienes o servicios disponibles en o a través de dichos sitios web o servicios.</p>

              <h2>4. Terminación</h2>
              <p>Podemos terminar o suspender Su acceso de inmediato, sin previo aviso ni responsabilidad, por cualquier motivo, incluido, entre otros, si Usted incumple los Términos.</p>
              <p>Al momento de la terminación, Su derecho a utilizar el Servicio cesará inmediatamente.</p>

              <h2>5. Limitación de Responsabilidad</h2>
              <p>En ningún caso Fermin, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo, incluyendo sin limitación, la pérdida de ganancias, datos, uso, fondo de comercio u otras pérdidas intangibles, que resulten de (i) Su acceso a o uso de, o incapacidad para acceder o usar el Servicio; (ii) cualquier conducta o contenido de cualquier tercero en el Servicio; (iii) cualquier contenido obtenido del Servicio; y (iv) el acceso, uso o alteración no autorizados de Sus transmisiones o contenido, ya sea con base en garantía, contrato, agravio (incluyendo negligencia) o cualquier otra teoría legal, independientemente de si Hemos sido informados o no de la posibilidad de dicho daño.</p>

              <h2>6. Descargo de Responsabilidad</h2>
              <p>Su uso del Servicio es bajo Su propio riesgo. El Servicio se proporciona "TAL CUAL" y "SEGÚN ESTÉ DISPONIBLE". El Servicio se proporciona sin garantías de ningún tipo, ya sean expresas o implícitas, incluyendo, entre otras, garantías implícitas de comerciabilidad, idoneidad para un propósito particular, no infracción o curso de rendimiento.</p>

              <h2>7. Ley Aplicable</h2>
              <p>Estos Términos se regirán e interpretarán de acuerdo con las leyes de Costa Rica, sin tener en cuenta las disposiciones sobre conflictos de leyes.</p>
              <p>Nuestra falta de hacer cumplir cualquier derecho o disposición de estos Términos no se considerará una renuncia a esos derechos. Si alguna disposición de estos Términos es considerada inválida o inaplicable por un tribunal, las disposiciones restantes de estos Términos permanecerán vigentes.</p>

              <h2>8. Cambios</h2>
              <p>Nos reservamos el derecho, a Nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es importante, intentaremos proporcionar un aviso de al menos 30 días antes de que los nuevos términos entren en vigencia. Lo que constituye un cambio importante se determinará a Nuestra entera discreción.</p>
              <p>Al continuar accediendo o utilizando Nuestro Servicio después de que esas revisiones se vuelvan efectivas, Usted acepta estar sujeto a los términos revisados. Si no acepta los nuevos términos, por favor deje de usar el Servicio.</p>

              <h2>9. Contáctenos</h2>
              <p>Si tiene alguna pregunta sobre estos Términos, por favor contáctenos:</p>
              <ul>
              <li><p>Por correo electrónico: fezgar12@gmail.com</p></li>
              <li><p>Por teléfono: +50687088364</p></li>
              </ul>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
