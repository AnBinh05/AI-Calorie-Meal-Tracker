import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MacroProgressBarProps {
  label: string;
  currentGrams: number;
  targetGrams: number;
  color: string;
}

export const MacroProgressBar: React.FC<MacroProgressBarProps> = ({
  label,
  currentGrams,
  targetGrams,
  color,
}) => {
  const percentage = Math.min(Math.max((currentGrams / (targetGrams || 1)) * 100, 0), 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>
          <Text style={{ color, fontWeight: '700' }}>{Math.round(currentGrams)}g</Text>
          <Text style={styles.targetText}> / {targetGrams}g</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    flex: 1,
    minWidth: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  values: {
    fontSize: 12,
  },
  targetText: {
    color: '#64748b',
  },
  track: {
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
