import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAboutUsStore } from '../src/store/useAboutUsStore';

export default function AboutScreen() {
  const { content } = useAboutUsStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heroTitle}>{content.heroTitle}</Text>
      <Text style={styles.heroSubtitle}>{content.heroSubtitle}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.text}>{content.mission}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.text}>{content.story}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Values</Text>
        {content.values.map((v, i) => (
          <View key={i} style={styles.valueCard}>
            <Text style={styles.valueIcon}>{v.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.valueTitle}>{v.title}</Text>
              <Text style={styles.valueDesc}>{v.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Team</Text>
        {content.teamMembers.map((t, i) => (
          <View key={i} style={styles.teamCard}>
            <Text style={styles.teamName}>{t.name}</Text>
            <Text style={styles.teamRole}>{t.role}</Text>
            <Text style={styles.teamBio}>{t.bio}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafaf9' },
  content: { padding: 24, paddingBottom: 60 },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  heroSubtitle: { fontSize: 18, color: '#4b5563', lineHeight: 28, marginBottom: 32 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#16a34a', marginBottom: 16 },
  text: { fontSize: 16, lineHeight: 24, color: '#374151' },
  valueCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  valueIcon: { fontSize: 32, marginRight: 16 },
  valueTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  valueDesc: { color: '#6b7280', lineHeight: 20 },
  teamCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  teamName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  teamRole: { fontSize: 14, color: '#16a34a', fontWeight: '600', marginBottom: 8 },
  teamBio: { color: '#4b5563' }
});
