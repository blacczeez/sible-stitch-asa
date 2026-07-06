'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Instagram } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { BRAND } from '@/lib/constants'
import { contactFormSchema, type ContactFormData } from '@/validations/contact'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Failed to send message')
      }

      toast.success('Message sent! We will get back to you within 1–2 business days.')
      reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-xl font-serif font-semibold mb-4">Get in Touch</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Have a question about your order, sizing, or our collection? We are here to help.
            Our team typically responds within 1–2 business days.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href={`mailto:${BRAND.email}`}
            className="flex items-center gap-3 text-sm hover:text-asa-wine transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-asa-gold/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-asa-gold" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-muted-foreground">{BRAND.email}</p>
            </div>
          </a>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-full bg-asa-gold/10 flex items-center justify-center shrink-0">
              <Instagram className="w-4 h-4 text-asa-gold" />
            </div>
            <div>
              <p className="font-medium">Social</p>
              <div className="flex gap-3 text-muted-foreground">
                <a href={BRAND.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-asa-wine transition-colors">
                  Instagram
                </a>
                <a href={BRAND.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-asa-wine transition-colors">
                  Facebook
                </a>
                <a href={BRAND.social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-asa-wine transition-colors">
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:col-span-3 space-y-5 rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-sm ring-1 ring-white/80"
      >
        <h2 className="text-lg font-semibold">Send a Message</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} className="mt-1" />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} className="mt-1" />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" {...register('subject')} className="mt-1" />
          {errors.subject && (
            <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            rows={5}
            {...register('message')}
            className="mt-1 resize-none"
          />
          {errors.message && (
            <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  )
}
