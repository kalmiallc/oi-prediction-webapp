import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormProps } from 'react-hook-form';
import { z } from 'zod';

/**
 * React Hook Form's useForm with zod schema validation.
 *
 * Implement useForm params as required.
 * https://react-hook-form.com/api/useform
 */
export default function useFormSchema<T extends z.ZodTypeAny>(
  schema: T,
  options?: UseFormProps<T> | any
) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: async (data, context, options) => {
      return zodResolver(schema)(data, context, options);
    },
    ...options,
  });
  return form;
}
