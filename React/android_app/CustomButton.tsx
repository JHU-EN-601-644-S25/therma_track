// CustomButton.js
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface props {
  title: string;
  color: string;
  onPress: () => void;
}
const CustomButton = ({title, color, onPress}: props) => {
  const styles = StyleSheet.create({
    button: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: color, // Green color
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
  });

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
