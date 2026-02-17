import { Trophy, Users, Shield, Clock } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      icon: Trophy,
      value: '200+',
      label: 'Sorteos Realizados',
      color: 'text-action-yellow',
    },
    {
      icon: Users,
      value: '10k',
      label: 'Pescadores Felices',
      color: 'text-splash-blue',
    },
    {
      icon: Shield,
      value: '100%',
      label: 'Seguro y Legal',
      color: 'text-bass-green',
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Soporte',
      color: 'text-orange-500',
    },
  ];

  return (
    <section className="py-8 bg-[#F4F4F4] dark:bg-[#1A1A1A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-3">
                  <Icon className={`${stat.color}`} size={32} />
                </div>
                <div className={`text-3xl font-display font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}