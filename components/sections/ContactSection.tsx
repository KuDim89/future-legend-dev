'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import styles from './ContactSection.module.scss';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);
  const mountTime = useRef<number>(Date.now());

  useScrollReveal(containerRef);

  const [formState, setFormState] = useState<FormState>('idle');
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot !== '') return;                         // spam: honeypot check — silently drop
    if (Date.now() - mountTime.current < 3000) return;  // spam: time check — silently drop
    setFormState('loading');
    try {
      const response = await fetch(
        'https://api.github.com/repos/KuDim89/future-legend-dev/actions/workflows/contact.yml/dispatches',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GH_PAT}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
          body: JSON.stringify({
            ref: 'main',
            inputs: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone || '',
              message: formData.message,
            },
          }),
        }
      );
      // CRITICAL: response.ok covers 204 No Content — NEVER check === 202
      setFormState(response.ok ? 'success' : 'error');
    } catch {
      setFormState('error');
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <section id="contact" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>Contact</h2>
      <p className={`${styles.intro} reveal-item`}>
        Get in touch — whether you are a scout, coach, or club representative.
      </p>

      <AnimatePresence mode="wait">
        {formState === 'success' ? (
          <motion.div
            key="success"
            role="status"
            className={styles.successMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p className={styles.successHeading}>Message Sent</p>
            <p>{"Your message has been sent. We'll be in touch soon."}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className={`${styles.form} reveal-item`}
            onSubmit={handleSubmit}
            aria-busy={formState === 'loading'}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Honeypot — hidden via CSS position absolute (NOT display:none) */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Name */}
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your full name"
                className={styles.input}
                value={formData.name}
                onChange={handleChange}
                disabled={formState === 'loading'}
              />
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                disabled={formState === 'loading'}
              />
            </div>

            {/* Phone — optional, type="tel", NOT required */}
            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>
                Phone (optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+380 XX XXX XXXX"
                className={styles.input}
                value={formData.phone}
                onChange={handleChange}
                disabled={formState === 'loading'}
              />
            </div>

            {/* Message */}
            <div className={styles.field}>
              <label htmlFor="message" className={styles.label}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                maxLength={1000}
                placeholder="Tell us what you have in mind..."
                className={styles.textarea}
                value={formData.message}
                onChange={handleChange}
                disabled={formState === 'loading'}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={formState === 'loading'}
            >
              {formState === 'loading' ? (
                <>
                  <Loader2 size={18} className={styles.spinner} aria-label="Sending..." />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>

            {/* Inline error — Framer Motion mount animation */}
            {formState === 'error' && (
              <motion.p
                role="alert"
                className={styles.errorMsg}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                Something went wrong. Please try again or email us directly at{' '}
                <a href="mailto:dimakyh@ukr.net">dimakyh@ukr.net</a>.
              </motion.p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
