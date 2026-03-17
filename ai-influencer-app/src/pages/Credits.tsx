import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, Badge, Button, Skeleton } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions } from '../lib/credits';
import type { CreditTransaction } from '../types';

const plans = [
  { name: 'Starter', credits: 100, price: 'R$ 29', popular: false },
  { name: 'Pro', credits: 500, price: 'R$ 99', popular: true },
  { name: 'Empire', credits: 2000, price: 'R$ 299', popular: false },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function Credits() {
  const { user, profile } = useAuth();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [creditsUsedToday, setCreditsUsedToday] = useState(0);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch transactions
      const txns = await getTransactions(user.id);
      setTransactions(txns);

      // Calculate credits used today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const usedToday = txns
        .filter(t => t.amount < 0 && new Date(t.created_at) >= today)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      setCreditsUsedToday(usedToday);
    } catch (err) {
      console.error('Failed to load credits data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate running balance for display
  const transactionsWithBalance = transactions.map((t, i) => {
    // Sum all transactions from this one forward to get balance at this point
    let balance = profile?.credits ?? 0;
    for (let j = 0; j < i; j++) {
      balance -= transactions[j].amount;
    }
    return { ...t, _balanceAfter: balance };
  });

  const creditsBalance = profile?.credits ?? 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Balance */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-r from-sidebar to-[#2a2a4e] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Saldo Atual</p>
              {loading ? (
                <Skeleton className="h-10 w-32 bg-white/10 mt-1" />
              ) : (
                <p className="text-4xl font-extrabold mt-1">{creditsBalance.toLocaleString()}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">créditos disponíveis</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Usado Hoje</p>
              {loading ? (
                <Skeleton className="h-8 w-16 bg-white/10 mt-1 ml-auto" />
              ) : (
                <p className="text-2xl font-bold text-credit-gold">{creditsUsedToday}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">créditos</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Plans */}
      <motion.div variants={item}>
        <h3 className="text-lg font-bold text-sidebar mb-4">Comprar Créditos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              hover
              className={plan.popular ? 'ring-2 ring-primary relative' : ''}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="primary">Mais Popular</Badge>
                </div>
              )}
              <div className="text-center py-2">
                <h4 className="font-bold text-sidebar">{plan.name}</h4>
                <p className="text-3xl font-extrabold text-sidebar mt-2">{plan.credits}</p>
                <p className="text-xs text-gray-400">créditos</p>
                <p className="text-lg font-bold text-primary mt-3">{plan.price}</p>
                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  size="sm"
                  className="mt-4 w-full"
                >
                  Comprar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Transactions */}
      <motion.div variants={item}>
        <Card>
          <CardHeader title="Histórico" subtitle="Todas as movimentações" />
          {loading ? (
            <div className="space-y-3 mt-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nenhuma transação ainda.</p>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-2">
                <span>Tipo</span>
                <span>Descrição</span>
                <span className="text-right">Valor</span>
                <span className="text-right">Data</span>
              </div>
              {transactionsWithBalance.map((t) => (
                <div key={t.id} className="grid grid-cols-4 items-center px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <div>
                    <Badge
                      variant={t.amount > 0 ? 'success' : 'default'}
                    >
                      {t.amount > 0 ? 'Entrada' : 'Uso'}
                    </Badge>
                  </div>
                  <span className="text-gray-700 truncate">{t.reason}</span>
                  <span className={`text-right font-semibold ${t.amount > 0 ? 'text-emerald-600' : 'text-gray-600'}`}>
                    {t.amount > 0 ? '+' : ''}{t.amount}
                  </span>
                  <span className="text-right text-gray-400 text-xs">
                    {new Date(t.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
