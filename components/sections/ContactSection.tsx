'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import styles from './ContactSection.module.scss';

type FormState = 'idle' | 'loading' | 'success' | 'error';

function formatPhone(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');

  // Strip leading country code variants: 380 or 0
  let local: string;
  if (digits.startsWith('380')) {
    local = digits.slice(3);
  } else if (digits.startsWith('0')) {
    local = digits.slice(1);
  } else {
    local = digits;
  }

  // Cap at 9 digits — Ukrainian format: XX XXX XXXX
  local = local.slice(0, 9);

  const p1 = local.slice(0, 2);
  const p2 = local.slice(2, 5);
  const p3 = local.slice(5, 9);

  let result = '+380';
  if (p1) result += ' ' + p1;
  if (p2) result += ' ' + p2;
  if (p3) result += ' ' + p3;

  return result;
}

export function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);
  const mountTime = useRef<number>(Date.now());

  useScrollReveal(containerRef);

  const [formState, setFormState] = useState<FormState>('idle');
  const [honeypot, setHoneypot] = useState('');
  const [nameError, setNameError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, phone: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleNameBlur() {
    if (formData.name.trim().length > 0 && formData.name.trim().length < 3) {
      setNameError('Name must be at least 3 characters');
    } else {
      setNameError('');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot !== '') return;
    if (Date.now() - mountTime.current < 3000) return;

    if (formData.name.trim().length < 3) {
      setNameError('Name must be at least 3 characters');
      return;
    }

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
              phone: formData.phone || '',
              message: formData.message,
            },
          }),
        }
      );
      setFormState(response.ok ? 'success' : 'error');
    } catch {
      setFormState('error');
    }
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
                className={`${styles.input} ${nameError ? styles.inputError : ''}`}
                value={formData.name}
                onChange={handleChange}
                onBlur={handleNameBlur}
                disabled={formState === 'loading'}
              />
              {nameError && (
                <motion.span
                  role="alert"
                  className={styles.fieldError}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {nameError}
                </motion.span>
              )}
            </div>

            {/* Phone */}
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
