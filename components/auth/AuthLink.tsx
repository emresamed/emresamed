import { Link, LinkProps } from 'expo-router';

import { Text } from '@/components/ui';

interface AuthLinkProps extends Omit<LinkProps, 'children'> {
  label: string;
}

export function AuthLink({ label, ...props }: AuthLinkProps) {
  return (
    <Link {...props} asChild>
      <Text variant="label" className="text-primary">
        {label}
      </Text>
    </Link>
  );
}
