import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- THEME COLORS ---
const COLORS = {
  primary: '#4E3629', // Deep Coffee Brown
  secondary: '#8D6E63', // Medium Brown
  accent: '#D4AF37', // Gold
  background: '#FDFBF7', // Cream
  cardBg: '#FFFFFF',
  textDark: '#2D1B13',
  textLight: '#9E8E87',
  lightBeige: '#F5EBE6',
  green: '#4CAF50',
  white: '#FFFFFF',
  gray: '#E0E0E0'
};

const { width, height } = Dimensions.get('window');

// --- MOCK DATA ---
const CATEGORIES = ['All', 'Popular', 'Espresso', 'Cold Brew', 'Sweet Treats'];

const COFFEE_PRODUCTS = [
  {
    id: '1',
    name: 'Classic Cappuccino',
    category: 'Popular',
    price: 4.50,
    rating: 4.9,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80',
    description: 'A delicate balance of rich espresso, velvety steamed milk, and a thick layer of luxurious foam. Topped with a dusting of cocoa powder.'
  },
  {
    id: '2',
    name: 'Caramel Macchiato',
    category: 'Sweet Treats',
    price: 5.25,
    rating: 4.8,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&q=80',
    description: 'Freshly steamed milk with vanilla-flavored syrup, marked with espresso and drizzled with decadent caramel sauce.'
  },
  {
    id: '3',
    name: 'Double Espresso',
    category: 'Espresso',
    price: 3.20,
    rating: 4.7,
    reviews: 85,
    image: 'https://images.unsplash.com/photo-1510972527409-cef190317417?w=600&q=80',
    description: 'Two shots of our signature intense, full-bodied espresso with a rich golden crema.'
  },
  {
    id: '4',
    name: 'Vanilla Cold Brew',
    category: 'Cold Brew',
    price: 4.95,
    rating: 4.9,
    reviews: 150,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80',
    description: 'Our slow-steeped cold brew coffee infused with sweet vanilla syrup and topped with a splash of cream.'
  },
  {
    id: '5',
    name: 'Mocha Frappé',
    category: 'Sweet Treats',
    price: 5.50,
    rating: 4.6,
    reviews: 74,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80',
    description: 'Rich mocha sauce blended with milk, ice, and espresso, finished with whipped cream and chocolate drizzle.'
  },
  {
    id: '6',
    name: 'Flat White',
    category: 'Espresso',
    price: 4.25,
    rating: 4.8,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&q=80',
    description: 'Smooth ristretto shots of espresso combined with perfect micro-foamed whole milk for a velvety texture.'
  }
];

// --- CONTEXT STATE ---
const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('Home'); // Home, Detail, Cart, Checkout
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (cartItem) => 
          cartItem.id === item.id && 
          cartItem.size === item.size && 
          cartItem.milk === item.milk && 
          cartItem.sweetener === item.sweetener
      );
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += item.quantity;
        newCart[existingIndex].totalPrice = newCart[existingIndex].unitPrice * newCart[existingIndex].quantity;
        return newCart;
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.cartId === cartItemId) {
            const newQty = item.quantity + amount;
            return { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider
      value={{
        cart,
        favorites,
        currentScreen,
        setCurrentScreen,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleFavorite,
        clearCart
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  return (
    <AppProvider>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <MainNavigator />
    </AppProvider>
  );
}

function MainNavigator() {
  const { currentScreen } = useContext(AppContext);

  return (
    <SafeAreaView style={styles.container}>
      {currentScreen === 'Home' && <HomeScreen />}
      {currentScreen === 'Detail' && <DetailScreen />}
      {currentScreen === 'Cart' && <CartScreen />}
      {currentScreen === 'Checkout' && <CheckoutScreen />}
      <BottomNavBar />
    </SafeAreaView>
  );
}

// --- NAVIGATION TAB BAR ---
function BottomNavBar() {
  const { currentScreen, setCurrentScreen, cart } = useContext(AppContext);

  if (currentScreen === 'Checkout') return null; // Hide navigation on checkout

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <View style={styles.navBar}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => setCurrentScreen('Home')}
      >
        <Ionicons 
          name={currentScreen === 'Home' ? "cafe" : "cafe-outline"} 
          size={24} 
          color={currentScreen === 'Home' ? COLORS.primary : COLORS.textLight}
        />
        <Text style={[styles.navText, currentScreen === 'Home' && styles.navTextActive]}>Shop</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => setCurrentScreen('Cart')}
      >
        <View>
          <Ionicons 
            name={currentScreen === 'Cart' ? "basket" : "basket-outline"} 
            size={24} 
            color={currentScreen === 'Cart' ? COLORS.primary : COLORS.textLight}
          />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.navText, currentScreen === 'Cart' && styles.navTextActive]}>Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- HOME SCREEN ---
function HomeScreen() {
  const {
    setSelectedProduct,
    setCurrentScreen,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    favorites,
    toggleFavorite
  } = useContext(AppContext);

  const filteredProducts = COFFEE_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setCurrentScreen('Detail');
  };

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Good morning 👋</Text>
          <Text style={styles.brandText}>XAFETR COFFEE</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' }} 
            style={styles.avatar} 
          />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
          placeholder="Find your perfect brew..."
          placeholderTextColor={COLORS.textLight}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories Scroll */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                activeCategory === cat && styles.categoryChipActive
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  activeCategory === cat && styles.categoryChipTextActive
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Coffee List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cafe-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No premium brews found.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isFav = favorites.includes(item.id);
          return (
            <TouchableOpacity 
              style={styles.productCard} 
              activeOpacity={0.9}
              onPress={() => handleProductPress(item)}
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <TouchableOpacity 
                style={styles.favoriteButton} 
                onPress={() => toggleFavorite(item.id)}
              >
                <Ionicons 
                  name={isFav ? "heart" : "heart-outline"} 
                  size={18} 
                  color={isFav ? '#E91E63' : COLORS.white}
                />
              </TouchableOpacity>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color={COLORS.accent} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category}</Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                  <View style={styles.plusButton}>
                    <Ionicons name="add" size={16} color={COLORS.white} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// --- DETAIL SCREEN ---
function DetailScreen() { 
  const { selectedProduct, setCurrentScreen, addToCart } = useContext(AppContext);
  const [size, setSize] = useState('M'); // S, M, L
  const [milk, setMilk] = useState('Whole Milk'); // Whole Milk, Skimmed, Almond, Oat
  const [sweetener, setSweetener] = useState('Normal Sugar'); // None, Light, Normal, Sweet
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  // Calculate custom prices
  const sizeExtra = size === 'S' ? -0.50 : size === 'L' ? 0.75 : 0.00;
  const milkExtra = (milk === 'Almond' || milk === 'Oat') ? 0.60 : 0.00;
  const unitPrice = selectedProduct.price + sizeExtra + milkExtra;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const cartItem = {
      cartId: `${selectedProduct.id}-${size}-${milk}-${sweetener}-${Date.now()}`,
      id: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      size,
      milk,
      sweetener,
      quantity,
      unitPrice,
      totalPrice
    };
    addToCart(cartItem);
    setCurrentScreen('Cart');
  };

  return (
    <View style={styles.screenContainer}>
      {/* Top Header Bar */}
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('Home')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Customize Brew</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Product Image */}
        <Image source={{ uri: selectedProduct.image }} style={styles.detailImage} />

        <View style={styles.detailContent}>
          <View style={styles.detailMeta}>
            <Text style={styles.detailName}>{selectedProduct.name}</Text>
            <View style={styles.detailRatingContainer}>
              <Ionicons name="star" size={16} color={COLORS.accent} />
              <Text style={styles.detailRating}>{selectedProduct.rating}</Text>
              <Text style={styles.detailReviews}>({selectedProduct.reviews} reviews)</Text>
            </View>
          </View>

          <Text style={styles.detailDescription}>{selectedProduct.description}</Text>

          {/* Size Selector */}
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.optionsRow}>
            {['S', 'M', 'L'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.optionChip,
                  size === s && styles.optionChipActive
                ]}
                onPress={() => setSize(s)}
              >
                <Text style={[styles.optionChipText, size === s && styles.optionChipTextActive]}>
                  {s === 'S' ? 'Small' : s === 'M' ? 'Medium' : 'Large'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Milk Selector */}
          <Text style={styles.sectionTitle}>Milk Options</Text>
          <View style={styles.optionsRow}>
            {['Whole Milk', 'Skimmed', 'Almond', 'Oat'].map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.optionChip,
                  milk === m && styles.optionChipActive
                ]}
                onPress={() => setMilk(m)}
              >
                <Text style={[styles.optionChipText, milk === m && styles.optionChipTextActive]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sweetener Selector */}
          <Text style={styles.sectionTitle}>Sweetener</Text>
          <View style={styles.optionsRow}>
            {['None', 'Light Sugar', 'Normal Sugar', 'Extra Sweet'].map((sw) => (
              <TouchableOpacity
                key={sw}
                style={[
                  styles.optionChip,
                  sweetener === sw && styles.optionChipActive
                ]}
                onPress={() => setSweetener(sw)}
              >
                <Text style={[styles.optionChipText, sweetener === sw && styles.optionChipTextActive]}>
                  {sw}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantityRow}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.qtySelector}>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={COLORS.textDark} />
              </TouchableOpacity>
              <Text style={styles.qtyVal}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buy Bar */}
      <View style={styles.buyBar}>
        <View>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.totalPriceText}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addToCartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- CART SCREEN ---
function CartScreen() {
  const { cart, updateCartQuantity, removeFromCart, setCurrentScreen } = useContext(AppContext);

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal > 0 ? 2.50 : 0;
  const total = subtotal + deliveryFee;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('Home')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Your Order</Text>
        <View style={{ width: 40 }} />
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="basket-outline" size={80} color={COLORS.textLight} />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartSub}>Add some delicious coffee to start your day!</Text>
          <TouchableOpacity style={styles.shopNowBtn} onPress={() => setCurrentScreen('Home')}>
            <Text style={styles.shopNowText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.cartId}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <Image source={{ uri: item.image }} style={styles.cartImage} />
                <View style={styles.cartInfo}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemSpecs}>
                    Size: {item.size} | {item.milk} | {item.sweetener}
                  </Text>
                  <Text style={styles.cartItemPrice}>${(item.unitPrice * item.quantity).toFixed(2)}</Text>
                </View>
                <View style={styles.cartActions}>
                  <TouchableOpacity 
                    style={styles.cartRemoveBtn} 
                    onPress={() => removeFromCart(item.cartId)}
                  >
                    <Ionicons name="trash-outline" size={18} color={COLORS.secondary} />
                  </TouchableOpacity>
                  <View style={styles.cartQtySelector}>
                    <TouchableOpacity 
                      style={styles.cartQtyBtn} 
                      onPress={() => updateCartQuantity(item.cartId, -1)}
                    >
                      <Ionicons name="remove" size={14} color={COLORS.textDark} />
                    </TouchableOpacity>
                    <Text style={styles.cartQtyVal}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.cartQtyBtn} 
                      onPress={() => updateCartQuantity(item.cartId, 1)}
                    >
                      <Ionicons name="add" size={14} color={COLORS.textDark} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Bill details */}
          <View style={styles.billContainer}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.billRow, styles.billTotalRow]}>
              <Text style={styles.billTotalLabel}>Total Amount</Text>
              <Text style={styles.billTotalValue}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity 
              style={styles.checkoutBtn} 
              onPress={() => setCurrentScreen('Checkout')}
            >
              <Text style={styles.checkoutBtnText}>Confirm & Place Order</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

// --- CHECKOUT & DELIVERY SIMULATOR SCREEN ---
const STEPS = [
  { title: 'Order Received', icon: 'receipt-outline', desc: 'XAFETR is preparing your receipt.' },
  { title: 'Brewing Coffee', icon: 'cafe-outline', desc: 'Our barista is crafting your custom cup.' },
  { title: 'Out for Delivery', icon: 'bicycle-outline', desc: 'Your coffee is hot and on the way.' },
  { title: 'Delivered', icon: 'checkmark-done-circle-outline', desc: 'Enjoy your coffee break!' }
];

function CheckoutScreen() {
  const { clearCart, setCurrentScreen } = useContext(AppContext);
  const [activeStep, setActiveStep] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Store order ID in a ref so it doesn't regenerate and change visually on every render step
  const orderId = useRef(Math.floor(Math.random() * 90000) + 10000).current;

  useEffect(() => {
    // Simulate order steps transition
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (activeStep / (STEPS.length - 1)) * 100,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, [activeStep]);

  const handleFinish = () => {
    clearCart();
    setCurrentScreen('Home');
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: COLORS.primary }]}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', padding: 24 }}>
        {/* Header */}
        <View style={styles.checkoutHeader}>
          <Text style={styles.checkoutTitle}>Order Tracking</Text>
          <Text style={styles.checkoutSubtitle}>Order ID: #XF-{orderId}</Text>
        </View>

        {/* Status Illustration / Center Card */}
        <View style={styles.statusCard}>
          <Ionicons 
            name={STEPS[activeStep].icon} 
            size={80} 
            color={COLORS.accent} 
            style={{ alignSelf: 'center', marginBottom: 16 }}
          />
          <Text style={styles.statusTitle}>{STEPS[activeStep].title}</Text>
          <Text style={styles.statusDesc}>{STEPS[activeStep].desc}</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <Animated.View 
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            />
          </View>
        </View>

        {/* Steps List */}
        <View style={styles.stepsContainer}>
          {STEPS.map((step, index) => {
            const isCompleted = index < activeStep;
            const isActive = index === activeStep;
            return (
              <View key={step.title} style={styles.stepRow}>
                <View style={[
                  styles.stepDot, 
                  isCompleted && styles.stepDotCompleted,
                  isActive && styles.stepDotActive
                ]}>
                  {isCompleted && <Ionicons name="checkmark" size={12} color={COLORS.white} />}
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={[
                    styles.stepLabel, 
                    (isActive || isCompleted) && styles.stepLabelActive
                  ]}>
                    {step.title}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Button */}
        <View>
          {activeStep === STEPS.length - 1 ? (
            <TouchableOpacity style={styles.doneBtn} onPress={handleFinish}>
              <Text style={styles.doneBtnText}>Order Another Coffee</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.brewingLoader}>
              <ActivityIndicator size="small" color={COLORS.accent} />
              <Text style={styles.loaderText}>Barista is preparing your magic...</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

// --- STYLES --- 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  screenContainer: {
    flex: 1,
    paddingTop: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500'
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 25,
    padding: 2
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBeige,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 48
  },
  searchIcon: { 
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: '500'
  },
  categoryContainer: {
    paddingLeft: 20,
    marginBottom: 15
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightBeige,
    marginRight: 10
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary
  },
  categoryChipText: {
    color: COLORS.textLight,
    fontWeight: '600',
    fontSize: 14
  },
  categoryChipTextActive: {
    color: COLORS.white
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 80
  },
  row: {
    justifyContent: 'space-between'
  },
  productCard: {
    backgroundColor: COLORS.cardBg,
    width: (width - 45) / 2,
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 10
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 15,
    padding: 6
  },
  ratingBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3
  },
  productDetails: {
    paddingHorizontal: 4
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark
  },
  productCategory: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
    marginBottom: 8
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  plusButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 4
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textLight
  },
  // Navigation Bar
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    paddingBottom: 5
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  navText: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    fontWeight: '500'
  },
  navTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold'
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: COLORS.accent,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold'
  },
  // Detail Screen
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  backButton: {
    padding: 5
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark
  },
  detailImage: {
    width: width - 40,
    height: 240,
    borderRadius: 24,
    alignSelf: 'center',
    marginVertical: 10
  },
  detailContent: {
    paddingHorizontal: 24,
    paddingTop: 10
  },
  detailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  detailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1
  },
  detailRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  detailRating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginLeft: 4,
    marginRight: 2
  },
  detailReviews: { 
    fontSize: 12,
    color: COLORS.textLight
  },
  detailDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 10,
    marginTop: 10
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightBeige,
    marginRight: 8,
    marginBottom: 8
  },
  optionChipActive: {
    backgroundColor: COLORS.primary
  },
  optionChipText: {
    color: COLORS.textDark,
    fontSize: 13,
    fontWeight: '500'
  },
  optionChipTextActive: {
    color: COLORS.white
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBeige,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  qtyBtn: {
    padding: 5
  },
  qtyVal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
    color: COLORS.textDark
  },
  buyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    paddingVertical: 15,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textLight
  },
  totalPriceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 16
  },
  addToCartBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold'
  },
  // Cart Screen
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 20
  },
  emptyCartSub: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24
  },
  shopNowBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25
  },
  shopNowText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold'
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  cartImage: {
    width: 70,
    height: 70,
    borderRadius: 12
  },
  cartInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  cartItemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark
  },
  cartItemSpecs: {
    fontSize: 11,
    color: COLORS.textLight,
    marginVertical: 4
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  cartActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  cartRemoveBtn: {
    padding: 4
  },
  cartQtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBeige,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  cartQtyBtn: {
    padding: 2
  },
  cartQtyVal: {
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: COLORS.textDark
  },
  billContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  billRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 10
  },
  billLabel: {
    fontSize: 14,
    color: COLORS.textLight
  },
  billValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark
  },
  billTotalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    paddingTop: 12,
    marginBottom: 20
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark
  },
  billTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center'
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold'
  },
  // Checkout / Delivery Screen
  checkoutHeader: {
    alignItems: 'center',
    marginTop: 20
  },
  checkoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white
  },
  checkoutSubtitle: {
    fontSize: 13,
    color: COLORS.lightBeige,
    marginTop: 4
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    marginVertical: 20,
    elevation: 4
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center'
  },
  statusDesc: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.lightBeige,
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent
  },
  stepsContainer: {
    paddingHorizontal: 10
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.lightBeige,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  stepDotActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.primary
  },
  stepDotCompleted: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accent
  },
  stepTextContainer: {
    flex: 1
  },
  stepLabel: {
    fontSize: 15,
    color: COLORS.lightBeige,
    fontWeight: '500'
  },
  stepLabelActive: {
    color: COLORS.white,
    fontWeight: 'bold'
  },
  doneBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center'
  },
  doneBtnText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold'
  },
  brewingLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loaderText: {
    color: COLORS.white,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500'
  }
});