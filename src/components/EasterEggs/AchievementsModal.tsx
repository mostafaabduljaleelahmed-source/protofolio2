import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { easterEggService, Achievement } from '../../services/easterEggService';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';

export const AchievementsModal: React.FC = () => {
  const { isAchievementsOpen, closeAchievements } = useUI();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (isAchievementsOpen) {
      setAchievements(easterEggService.getAchievements());
    }
  }, [isAchievementsOpen]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Modal
      isOpen={isAchievementsOpen}
      onClose={closeAchievements}
      title="Secret System Achievements"
      headerIcon={<Trophy size={20} color="var(--orange)" />}
      headerExtra={
        <Badge variant="shipped" style={{ background: 'rgba(232, 154, 97, 0.15)', color: 'var(--orange)' }}>
          {unlockedCount} / {achievements.length} Unlocked
        </Badge>
      }
      maxWidth="560px"
      ariaLabel="Secret System Achievements"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {achievements.map(ach => (
          <div
            key={ach.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '12px 14px',
              borderRadius: '10px',
              background: ach.unlocked ? 'rgba(136, 217, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              border: ach.unlocked ? '1px solid rgba(136, 217, 255, 0.25)' : '1px dashed rgba(255, 255, 255, 0.06)',
              opacity: ach.unlocked ? 1 : 0.6
            }}
          >
            <div style={{ fontSize: '1.8rem', minWidth: '40px', textAlign: 'center' }}>
              {ach.unlocked ? ach.icon : '🔒'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: ach.unlocked ? '#ffffff' : 'var(--text-muted)' }}>
                  {ach.title}
                </h4>
                {ach.unlocked ? (
                  <CheckCircle2 size={14} color="var(--emerald)" />
                ) : (
                  <Lock size={12} color="var(--text-dim)" />
                )}
              </div>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {ach.description}
              </p>
            </div>

            {ach.unlocked && ach.unlockedAt && (
              <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>
                {ach.unlockedAt}
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};
