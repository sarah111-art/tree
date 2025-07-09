import { createContext, useContext, useState, useEffect } from 'react';
import productsData from '../assets/data';

const ShopContext = createContext();
export const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  
  // Get current userId for wishlist
  const getUserId = () => {
    const raw = localStorage.getItem('user');
    try {
      return raw ? JSON.parse(raw)?._id || 'guest' : 'guest';
    } catch {
      return 'guest';
    }
  };

  // wishlist theo user
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem(`wishlist_${getUserId()}`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const userId = getUserId();
    localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const userId = getUserId();
    const stored = localStorage.getItem(`wishlist_${userId}`);
    setWishlist(stored ? JSON.parse(stored) : []);
  }, [user]);

const addToWishlist = (product) => {
  setWishlist((prev) => {
    if (prev.find((item) => item._id === product._id)) return prev; // 🧠 dùng _id
    return [...prev, product];
  });
};

const removeFromWishlist = (productId) => {
  setWishlist((prev) => prev.filter((item) => item._id !== productId)); // 🧠 dùng _id
};

  // cart
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // load sản phẩm
useEffect(() => {
const fetchData = async () => {
  try {
    const [productRes, categoryRes] = await Promise.all([
      fetch(`${backendUrl}/api/products`),
      fetch(`${backendUrl}/api/categories`),
    ]);

    const [productData, categoryData] = await Promise.all([
      productRes.json(),
      categoryRes.json(),
    ]);

    // Tạo map: _id -> slug
    const categoryMap = {};
    categoryData.forEach((cat) => {
      categoryMap[cat._id] = cat.slug;
    });

    // Thêm categorySlug cho từng product
    const productsWithSlug = productData.map((p) => ({
      ...p,
      categorySlug: categoryMap[p.category?._id || p.category] || '',
    }));

    setProducts(productsWithSlug);
    setCategories(categoryData);
  } catch (err) {
    console.error('Lỗi khi tải sản phẩm hoặc danh mục:', err);
  }
};

  fetchData();
}, []);


  // load user/token
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const rawUser = localStorage.getItem('user');
    if (savedToken) setToken(savedToken);
    if (rawUser) {
      try {
        const parsedUser = JSON.parse(rawUser);
        setUser(parsedUser);
      } catch (err) {
        console.warn('Invalid user data:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // lưu user/token
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');

    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [token, user]);

  const contextValue = {
    products,
    categories,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    backendUrl,
    token,
    setToken,
    user,
    setUser,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    setCartItems,
  };

  return <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>;
};

export const useShop = () => useContext(ShopContext);
export const useWishlist = () => {
  const { wishlist, addToWishlist, removeFromWishlist } = useShop();
  return { wishlist, addToWishlist, removeFromWishlist };
};
