import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { trpc } from '@/lib/trpc';

export function BackendTest() {
  const healthQuery = trpc.example.health.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const hiMutation = trpc.example.hi.useMutation({
    onSuccess: (data) => {
      Alert.alert('Success!', `Backend responded: ${data.hello}`);
    },
    onError: (error) => {
      Alert.alert('Error', `Backend error: ${error.message}`);
    },
  });

  const testBackend = () => {
    hiMutation.mutate({ name: 'Test User' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend Connection Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Health Check:</Text>
        <Text style={[styles.status, { color: healthQuery.isLoading ? '#FFA500' : healthQuery.isError ? '#FF4444' : '#00AA00' }]}>
          {healthQuery.isLoading ? 'Checking...' : healthQuery.isError ? 'Failed' : 'Connected'}
        </Text>
      </View>

      {healthQuery.data && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Status: {healthQuery.data.status}</Text>
          <Text style={styles.dataText}>Message: {healthQuery.data.message}</Text>
        </View>
      )}

      {healthQuery.isError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {healthQuery.error.message}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.testButton} 
        onPress={testBackend}
        disabled={hiMutation.isPending}
      >
        <Text style={styles.testButtonText}>
          {hiMutation.isPending ? 'Testing...' : 'Test Backend'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={() => healthQuery.refetch()}
        disabled={healthQuery.isLoading}
      >
        <Text style={styles.refreshButtonText}>Refresh Health Check</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dataText: {
    fontSize: 14,
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#ffe8e8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#cc0000',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});