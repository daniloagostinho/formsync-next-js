export interface UseCase {
  title: string;
  description: string;
}

export interface Plan {
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  badge?: string;
  popular?: boolean;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'accent';
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface Stat {
  value: string;
  description: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
  color: 'indigo' | 'blue' | 'yellow' | 'green' | 'purple' | 'red';
}

export interface HowItWorks {
  title: string;
  description: string;
  icon: string;
  color: 'green' | 'purple' | 'red';
}
