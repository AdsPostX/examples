// ... existing code ...
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';

const Stack = createNativeStackNavigator();

/**
 * App Component
 *
 * Root component of the application that sets up the navigation structure.
 * Uses React Navigation to manage screen transitions between Home and Checkout screens.
 *
 * @component
 */
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: true,
            title: 'MomentScience SDK Demo',
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
