import {View, Text, TouchableOpacity} from 'react-native';

interface props {
  onClose: () => void;
  children: React.ReactNode;
}

function PopupComp({onClose, children}: props) {
  return (
    <View>
      <TouchableOpacity onPress={onClose}>
        <Text>✖</Text>
      </TouchableOpacity>
      {children}
    </View>
  );
}

export default PopupComp;
