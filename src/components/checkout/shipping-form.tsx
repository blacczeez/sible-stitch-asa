'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { shippingAddressSchema, type ShippingAddress } from '@/validations/checkout'
import { CheckoutButton } from './checkout-button'

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
]

export function ShippingForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      country: 'US',
    },
  })

  return (
    <form id="checkout-form" className="space-y-6 bg-white border rounded-lg p-6">
      <h2 className="text-lg font-semibold">Shipping Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register('firstName')} className="mt-1" />
          {errors.firstName && (
            <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register('lastName')} className="mt-1" />
          {errors.lastName && (
            <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} className="mt-1" />
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" {...register('phone')} className="mt-1" />
        {errors.phone && (
          <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="line1">Address</Label>
        <Input id="line1" {...register('line1')} className="mt-1" />
        {errors.line1 && (
          <p className="text-xs text-destructive mt-1">{errors.line1.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
        <Input id="line2" {...register('line2')} className="mt-1" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register('city')} className="mt-1" />
          {errors.city && (
            <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="state">State / Province</Label>
          <Input id="state" {...register('state')} className="mt-1" />
          {errors.state && (
            <p className="text-xs text-destructive mt-1">{errors.state.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" {...register('postalCode')} className="mt-1" />
          {errors.postalCode && (
            <p className="text-xs text-destructive mt-1">{errors.postalCode.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Country</Label>
        <Select
          defaultValue="US"
          onValueChange={(val) => setValue('country', val)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && (
          <p className="text-xs text-destructive mt-1">{errors.country.message}</p>
        )}
      </div>

      <CheckoutButton onSubmit={handleSubmit} />
    </form>
  )
}
