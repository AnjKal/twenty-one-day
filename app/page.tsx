'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface Challenge {
  id: string;
  name: string;
  description: string;
  days: number;
  completedDays: boolean[];
}

export default function Home() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    description: '',
    days: 21,
  });

  const handleCreateChallenge = () => {
    if (newChallenge.name.trim() === '') {
      setFormError('Please enter a challenge name');
      return;
    }

    // Generate a unique ID with fallback for environments without crypto.randomUUID()
    const generateId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      // Fallback: timestamp + random number
      return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    };

    const challenge: Challenge = {
      id: generateId(),
      name: newChallenge.name,
      description: newChallenge.description,
      days: newChallenge.days,
      completedDays: Array(newChallenge.days).fill(false),
    };

    setChallenges([...challenges, challenge]);
    setNewChallenge({ name: '', description: '', days: 21 });
    setFormError('');
    setIsCreating(false);
  };

  const toggleStar = (challengeId: string, dayIndex: number) => {
    setChallenges(
      challenges.map((challenge) => {
        if (challenge.id === challengeId) {
          const updatedCompletedDays = [...challenge.completedDays];
          updatedCompletedDays[dayIndex] = !updatedCompletedDays[dayIndex];
          return { ...challenge, completedDays: updatedCompletedDays };
        }
        return challenge;
      })
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>21 Day Challenge</h1>
        <p className={styles.subtitle}>Start a new habit or practice something refreshing!</p>
      </header>

      <div className={styles.content}>
        <div className={styles.createSection}>
          <button
            className={styles.createButton}
            onClick={() => setIsCreating(true)}
            title="Create Challenge"
          >
            <span className={styles.plusIcon}>+</span>
            <span>Create Challenge</span>
          </button>
        </div>

        {isCreating && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Create New Challenge</h2>
              {formError && <div className={styles.errorMessage}>{formError}</div>}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateChallenge();
                }}
              >
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Challenge Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={styles.input}
                    value={newChallenge.name}
                    onChange={(e) => {
                      setNewChallenge({ ...newChallenge, name: e.target.value });
                      setFormError('');
                    }}
                    placeholder="e.g., Daily Exercise"
                    autoFocus
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    className={styles.textarea}
                    value={newChallenge.description}
                    onChange={(e) =>
                      setNewChallenge({ ...newChallenge, description: e.target.value })
                    }
                    placeholder="Describe your challenge..."
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="days" className={styles.label}>
                    Number of Days: {newChallenge.days}
                  </label>
                  <input
                    type="range"
                    id="days"
                    className={styles.slider}
                    min="1"
                    max="30"
                    value={newChallenge.days}
                    onChange={(e) =>
                      setNewChallenge({ ...newChallenge, days: parseInt(e.target.value) })
                    }
                  />
                  <div className={styles.dayPreview}>
                    {Array.from({ length: newChallenge.days }, (_, i) => (
                      <span key={i} className={styles.previewStar}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Create Challenge
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className={styles.challengesList}>
          {challenges.map((challenge) => (
            <div key={challenge.id} className={styles.challengeCard}>
              <div className={styles.challengeHeader}>
                <h3 className={styles.challengeName}>{challenge.name}</h3>
                <button className={styles.inviteButton}>
                  <span className={styles.inviteIcon}>👥</span>
                  Invite People
                </button>
              </div>
              {challenge.description && (
                <p className={styles.challengeDescription}>{challenge.description}</p>
              )}
              <div className={styles.starsContainer}>
                {challenge.completedDays.map((isCompleted, index) => (
                  <button
                    key={index}
                    className={`${styles.star} ${
                      isCompleted ? styles.starCompleted : styles.starIncomplete
                    }`}
                    onClick={() => toggleStar(challenge.id, index)}
                    title={`Day ${index + 1}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className={styles.progress}>
                Progress: {challenge.completedDays.filter((d) => d).length} / {challenge.days} days
              </div>
            </div>
          ))}
        </div>

        {challenges.length === 0 && !isCreating && (
          <div className={styles.emptyState}>
            <p>No challenges yet. Click the button above to create your first challenge!</p>
          </div>
        )}
      </div>
    </div>
  );
}
