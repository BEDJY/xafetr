import { useEffect, useRef, useState } from "react";

import type { ChangeEvent, SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { v4 as uuid } from "uuid";

import AIChatPanel from "./components/ai/AIChatPanel";
import FloatingAIButton from "./components/ai/FloatingAIButton";
import AnalyticsCharts from "./components/AnalyticsCharts";
import FilterBar from "./components/FilterBar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import KpiStats from "./components/KpiStats";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import Button from "./components/ui/Button";
import ColorCircle from "./components/ui/ColorCircle";
import ErrorMessage from "./components/ui/ErrorMessage";
import Input from "./components/ui/Input";
import Modal from "./components/ui/Modal";
import Select from "./components/ui/Select";
import Toast, { type ToastMessage } from "./components/ui/Toast";
import { AIProvider } from "./context/AIContext";
import { useAuth } from "./context/AuthContext";
import { useChannel } from "./context/ChannelContext";
import { ChannelSelectionModal } from "./components/ChannelSelectionModal";
import { Loader2, BarChart3, Box, Search } from "lucide-react";
import { ProductService } from "./services/productService";
import { categories, colors, formInputsList } from "./data";

import type { Product } from "./interfaces";
import { Sidebar } from "./components/Sidebar";
import { DashboardOverview } from "./pages/dashboard/DashboardOverview";
import { CommandPalette } from "./components/CommandPalette";
import {
  OrdersPage,
  CollectionsPage,
  CustomersPage,
  ChannelsPage,
  AdministratorsPage,
  JobQueuePage,
  AssetsPage,
  PromotionsPage,
  ShippingMethodsPage,
  PaymentMethodsPage,
} from "./pages/vendure/VendurePages";
import { FacetsPage } from "./pages/facets/FacetsPage";
import { ProductVariantsPage } from "./pages/variants/ProductVariantsPage";
import CookiesPage from "./pages/legal/CookiesPage";
import PrivacyPage from "./pages/legal/PrivacyPage";
import TermsPage from "./pages/legal/TermsPage";
import LoginPage from "./pages/login/LoginPage";
import CreateStorePage from "./pages/onboarding/CreateStorePage";
import StoreSettingsPage from "./pages/store-settings/StoreSettingsPage";
import AlegraPage from "./pages/alegra/AlegraPage";
import SettingsPage from "./pages/settings/SettingsPage";
import ApiPage from "./pages/support/ApiPage";
import DocsPage from "./pages/support/DocsPage";
import HelpPage from "./pages/support/HelpPage";
import { RolesPage } from "./pages/roles/RolesPage";
import { CustomerGroupsPage } from "./pages/customer-groups/CustomerGroupsPage";
import { StockLocationsPage } from "./pages/stock-locations/StockLocationsPage";
import { TaxesPage } from "./pages/taxes/TaxesPage";
import { ZonesPage } from "./pages/zones/ZonesPage";
import { SellersPage } from "./pages/sellers/SellersPage";
import { SystemHealthPage } from "./pages/system/SystemHealthPage";
import { VariantGeneratorModal } from "./components/VariantGeneratorModal";
import { AssetPickerDialog } from "./components/AssetPickerDialog";
import { AssignFacetValuesModal } from "./components/AssignFacetValuesModal";

import { productValidation } from "./schema";
import { getLocalizedText } from "./utils/productUtils";

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  isMobile: boolean = false,
): (number | string)[] {
  if (!isMobile) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const delta = 1;

  const left = currentPage - delta;
  const right = currentPage + delta;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | null = null;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l !== null) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }

    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

function ProductsView({
  open,
  products,
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  sortBy,
  setSortBy,
  setProductToEdit,
  onDeleteProduct,
  isLoading = false,
}: {
  open: () => void;
  products: Product[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  setProductToEdit: (selectedProduct: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  isLoading?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("products_dashboard_page");

      if (saved) {
        const parsed = parseInt(saved, 10);
        return parsed > 0 ? parsed : 1;
      }
    }

    return 1;
  });

  const [stockStatus, setStockStatus] = useState("all");

  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }

    return 1024;
  });

  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 8;
      if (window.innerWidth >= 640) return 6;

      return 4;
    }

    return 8;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setWindowWidth(width);

      if (width >= 1024) {
        setItemsPerPage(8);
      } else if (width >= 640) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(4);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  useEffect(() => {
    localStorage.setItem("products_dashboard_page", String(currentPage));
  }, [currentPage]);

  const prevFiltersRef = useRef({
    searchQuery,
    filterCategory,
    sortBy,
    stockStatus,
  });

  useEffect(() => {
    const prev = prevFiltersRef.current;

    if (
      prev.searchQuery !== searchQuery ||
      prev.filterCategory !== filterCategory ||
      prev.sortBy !== sortBy ||
      prev.stockStatus !== stockStatus
    ) {
      setCurrentPage(1);

      prevFiltersRef.current = {
        searchQuery,
        filterCategory,
        sortBy,
        stockStatus,
      };
    }
  }, [searchQuery, filterCategory, sortBy, stockStatus]);

  const filteredProducts = products
    .filter((p) => {
      const pTitle = getLocalizedText(p.title, currentLang);
      const pDesc = getLocalizedText(p.description, currentLang);

      const matchesSearch =
        pTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pDesc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filterCategory === "all" ||
        p.category.name.toLowerCase() === filterCategory.toLowerCase();

      const itemStock = p.stock ?? 15;

      const matchesStock =
        stockStatus === "all" ||
        (stockStatus === "in-stock" && itemStock > 10) ||
        (stockStatus === "low-stock" && itemStock > 0 && itemStock <= 10) ||
        (stockStatus === "out-of-stock" && itemStock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "price-desc") {
        return Number(b.price) - Number(a.price);
      }

      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || "2026-07-01").getTime() -
          new Date(a.createdAt || "2026-07-01").getTime()
        );
      }

      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }

      if (sortBy === "title-asc") {
        const titleA = getLocalizedText(a.title, currentLang);
        const titleB = getLocalizedText(b.title, currentLang);
        return titleA.localeCompare(titleB);
      }

      return 0;
    });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const validPage = Math.max(1, Math.min(currentPage, totalPages));

  useEffect(() => {
    if (currentPage > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    const grid = document.getElementById("products-grid");

    if (grid) {
      grid.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <main className="container mx-auto max-w-7xl min-w-0 flex-1 p-3.5 pt-6 sm:p-5 sm:pt-8">
      <Hero onAddProduct={open} />

      <div id="analytics-section" className="scroll-mt-24">
        <KpiStats products={products} />
      </div>

      <div id="categories-section" className="scroll-mt-24">
        <AnalyticsCharts products={products} />
      </div>

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={filterCategory}
        setSelectedCategory={setFilterCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        stockStatus={stockStatus}
        setStockStatus={setStockStatus}
        categories={categories}
        totalResults={filteredProducts.length}
        totalProducts={products.length}
      />

      {isLoading ? (
        <div className="my-10 flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-white p-16 text-center dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500 mb-3" />
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
            Sincronizando catálogo con Vendure...
          </h4>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Consultando productos y variantes del canal activo en tiempo real.
          </p>
        </div>
      ) : paginatedProducts.length > 0 ? (
        <>
          <div
            id="products-grid"
            key={`page-${validPage}`}
            className="animate-in fade-in grid grid-cols-1 gap-6 duration-300 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          >
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                setProductToEdit={setProductToEdit}
                onDelete={onDeleteProduct}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex w-full min-w-0 flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row dark:border-zinc-800">
              <span className="text-center text-xs font-medium wrap-break-word text-gray-500 sm:text-start dark:text-zinc-400">
                {t("common.showing", "Showing")}{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {startIndex + 1}-{endIndex}
                </span>{" "}
                {t("common.of", "of")}{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {totalItems}
                </span>{" "}
                {t("common.products", "products")}
              </span>

              <div className="flex max-w-full min-w-0 flex-row flex-nowrap items-center justify-center gap-0.5 min-[360px]:gap-1 sm:gap-1.5">
                <button
                  type="button"
                  disabled={validPage === 1}
                  onClick={() => handlePageChange(validPage - 1)}
                  className="flex h-7.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-1.5 text-[10px] font-semibold text-gray-700 shadow-xs transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 min-[380px]:px-2 sm:h-9 sm:rounded-xl sm:px-3 sm:text-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {t("common.prev", "← Prev")}
                </button>

                <div className="flex min-w-0 flex-row flex-nowrap items-center justify-center gap-0.5 min-[360px]:gap-1 sm:gap-1.5">
                  {getPaginationRange(validPage, totalPages, isMobile).map(
                    (item, idx) => {
                      if (typeof item === "string") {
                        return (
                          <span
                            key={`dots-${idx}`}
                            className="flex h-7.5 min-w-3.5 shrink-0 items-center justify-center text-[10px] font-bold text-gray-400 select-none sm:h-9 sm:min-w-6 sm:text-xs dark:text-zinc-500"
                          >
                            ...
                          </span>
                        );
                      }

                      const page = item;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`flex h-7.5 min-w-5.5 shrink-0 cursor-pointer items-center justify-center rounded-lg px-1 text-[10px] font-bold transition-all sm:h-9 sm:min-w-9 sm:rounded-xl sm:px-0 sm:text-xs ${
                            page === validPage
                              ? "bg-accent shadow-accent-glow scale-105 text-white"
                              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  type="button"
                  disabled={validPage === totalPages}
                  onClick={() => handlePageChange(validPage + 1)}
                  className="flex h-7.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-1.5 text-[10px] font-semibold text-gray-700 shadow-xs transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 min-[380px]:px-2 sm:h-9 sm:rounded-xl sm:px-3 sm:text-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {t("common.next", "Next →")}
                </button>
              </div>
            </div>
          )}
        </>
      ) : products.length === 0 ? (
        <div className="my-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <div className="rounded-2xl bg-sky-50 p-4 dark:bg-sky-950/30 mb-3 text-sky-600 dark:text-sky-400">
            <span className="text-3xl">📦</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-white">
            Tu tienda aún no tiene productos
          </h4>
          <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
            Comienza a armar tu catálogo agregando productos con imágenes, variantes de precio y stock.
          </p>
          <button
            type="button"
            onClick={open}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition cursor-pointer"
          >
            <span>+ Crear Primer Producto</span>
          </button>
        </div>
      ) : (
        <div className="my-6 rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-3xl">🔍</span>

          <h4 className="mt-3 text-base font-bold text-gray-900 dark:text-white">
            {t("filters.noProductsFound", "No products found")}
          </h4>

          <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
            {t(
              "filters.noProductsMessage",
              "No items match your search query or filter criteria. Try resetting filters.",
            )}
          </p>

          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setFilterCategory("all");
              setSortBy("default");
            }}
            className="mt-4 cursor-pointer rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t("common.resetFilters", "Reset Filters")}
          </button>
        </div>
      )}
    </main>
  );
}

function AppContent() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const defaultProduct: Product = {
    title: "",
    description: "",
    slug: "",
    enabled: true,
    imageURL: "",
    price: "",
    colors: [],
    enOfertaFlash: false,
    porcentajeDescuento: 0,
    precioAnterior: undefined,
    category: {
      name: "",
      imageURL: "",
    },
  };

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      document.body.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [isOpen, setIsOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Pestañas y gestión de variantes en modal
  const [activeModalTab, setActiveModalTab] = useState<'general' | 'variants' | 'facets' | 'flash'>('general');
  const [newVarName, setNewVarName] = useState('');
  const [newVarSku, setNewVarSku] = useState('');
  const [newVarPrice, setNewVarPrice] = useState('');
  const [newVarStock, setNewVarStock] = useState('20');
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [isVariantGenOpen, setIsVariantGenOpen] = useState(false);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [isAssignFacetsOpen, setIsAssignFacetsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [mainViewTab, setMainViewTab] = useState<'dashboard' | 'products'>(() => {
    return (localStorage.getItem('mainViewTab') as 'dashboard' | 'products') || 'dashboard';
  });

  const handleSetMainViewTab = (tab: 'dashboard' | 'products') => {
    setMainViewTab(tab);
    localStorage.setItem('mainViewTab', tab);
  };

  // Atajo global Ctrl+K / Cmd+K para paleta de comandos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { activeChannel, setActiveChannel } = useChannel();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(true);

  // Sincronizar catálogo real de Vendure
  useEffect(() => {
    let isMounted = true;
    const fetchVendureProducts = async () => {
      setIsProductsLoading(true);
      try {
        const res = await ProductService.getProducts(100, 0);
        if (isMounted) {
          if (res.items && res.items.length > 0) {
            const mapped: Product[] = res.items.map((vp) => {
              const firstVariant = vp.variants[0];
              const priceVal = firstVariant ? (firstVariant.price / 100).toFixed(2) : "0.00";

              // Inferir categoría según el nombre del producto
              const nameLower = vp.name.toLowerCase();
              let catName = "Electronics";
              if (nameLower.includes("jeans") || nameLower.includes("chaqueta") || nameLower.includes("blusa") || nameLower.includes("vestido")) {
                catName = "Clothes";
              } else if (nameLower.includes("sérum") || nameLower.includes("crema") || nameLower.includes("solar") || nameLower.includes("sombras") || nameLower.includes("labial") || nameLower.includes("maquillaje") || nameLower.includes("shampoo") || nameLower.includes("parfum") || nameLower.includes("mist")) {
                catName = "Beauty";
              } else if (nameLower.includes("sofa") || nameLower.includes("chair") || nameLower.includes("desk") || nameLower.includes("table") || nameLower.includes("stool")) {
                catName = "Furniture";
              } else if (nameLower.includes("cactus") || nameLower.includes("tulip") || nameLower.includes("plant") || nameLower.includes("aloe") || nameLower.includes("fern") || nameLower.includes("bonsai")) {
                catName = "Plants";
              } else if (nameLower.includes("bike") || nameLower.includes("skipping") || nameLower.includes("tent") || nameLower.includes("boxing") || nameLower.includes("football") || nameLower.includes("basketball") || nameLower.includes("shoe") || nameLower.includes("sneakers") || nameLower.includes("tenis") || nameLower.includes("running")) {
                catName = "Sports";
              }

              return {
                id: vp.id,
                title: vp.name,
                description: vp.description || "Producto oficial sincronizado de Vendure Core",
                slug: vp.slug,
                enabled: vp.enabled ?? true,
                imageURL: vp.featuredAsset?.preview || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
                price: priceVal,
                colors: ["#10b981", "#3b82f6", "#f59e0b"],
                stock: firstVariant?.stockOnHand ?? 25,
                sku: firstVariant?.sku || `SKU-${vp.id}`,
                enOfertaFlash: firstVariant?.customFields?.enOfertaFlash ?? false,
                porcentajeDescuento: firstVariant?.customFields?.porcentajeDescuento ?? 0,
                precioAnterior: firstVariant?.customFields?.precioAnterior ?? undefined,
                variants: vp.variants,
                facetValues: (vp as any).facetValues,
                category: {
                  name: catName,
                  imageURL: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
                },
              };
            });
            setProducts(mapped);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.warn("Aviso al consultar catálogo de Vendure:", err);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsProductsLoading(false);
        }
      }
    };

    fetchVendureProducts();

    const handleReload = () => {
      fetchVendureProducts();
    };

    window.addEventListener("channel-changed", handleReload);
    window.addEventListener("auth-changed", handleReload);

    return () => {
      isMounted = false;
      window.removeEventListener("channel-changed", handleReload);
      window.removeEventListener("auth-changed", handleReload);
    };
  }, [activeChannel?.id, activeChannel?.token]);

  const [product, setProduct] = useState<Product>(defaultProduct);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: "",
  });

  const [tempColors, settempColors] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilterCategory(cat.toLowerCase());
    } else {
      setFilterCategory("all");
    }
  }, [searchParams]);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.pathname, location.hash]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ) => {
    setToasts((prev) => {
      const existing = prev.find(
        (t) => t.title === title && t.message === message,
      );

      if (existing) {
        const filtered = prev.filter((t) => t.id !== existing.id);

        return [
          ...filtered,
          {
            ...existing,
            count: (existing.count || 1) + 1,
            resetCounter: (existing.resetCounter || 0) + 1,
          },
        ];
      }

      return [
        ...prev,
        {
          id: uuid(),
          type,
          title,
          message,
          count: 1,
          resetCounter: 0,
        },
      ];
    });
  };

  /*
   * -------------------------
   * HANDLERS
   * -------------------------
   */

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const open = () => {
    setProductToEdit(null);
    setProduct(defaultProduct);
    settempColors([]);
    setSelectedCategory(categories[0]);
    setActiveModalTab('general');
    setIsOpen(true);
  };

  const openEditModal = (selectedProduct: Product) => {
    setProductToEdit(selectedProduct);

    setProduct({
      ...selectedProduct,
      slug: selectedProduct.slug || "",
      enabled: selectedProduct.enabled ?? true,
    });

    settempColors(selectedProduct.colors || []);

    const matchedCategory = categories.find(
      (category) => category.name === selectedProduct.category.name,
    );

    if (matchedCategory) {
      setSelectedCategory(matchedCategory);
    }

    setErrors({
      title: "",
      description: "",
      imageURL: "",
      price: "",
      colors: "",
    });

    setActiveModalTab('general');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddVariantToProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productToEdit?.id || !newVarName.trim() || !newVarPrice.trim()) return;

    setIsAddingVariant(true);
    try {
      await ProductService.addVariantToProduct({
        productId: productToEdit.id,
        name: newVarName.trim(),
        sku: newVarSku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        price: parseFloat(newVarPrice) || 0,
        stockOnHand: parseInt(newVarStock, 10) || 15,
      });

      addToast("success", "Variante Creada ✨", `Se creó la variante "${newVarName}".`);
      setNewVarName("");
      setNewVarSku("");
      setNewVarPrice("");
      window.dispatchEvent(new CustomEvent("channel-changed"));
    } catch (err: any) {
      addToast("error", "Error al crear variante", err.message);
    } finally {
      setIsAddingVariant(false);
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const onSubmitHandler = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, description, imageURL, price } = product;

    const validationErrors = productValidation({
      title: getLocalizedText(title, currentLang),
      description: getLocalizedText(description, currentLang),
      imageURL,
      price,
      colors: tempColors,
    });

    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== "",
    );

    if (hasErrors) {
      setErrors(validationErrors);

      addToast(
        "error",
        t("products.validationFailed", "Validation Failed ⚠️"),
        t(
          "products.validationFailedMsg",
          "Please check the form inputs before submitting.",
        ),
      );

      return;
    }

    /*
     * EDIT EXISTING PRODUCT
     */
    if (productToEdit) {
      const updatedProduct: Product = {
        ...product,
        id: productToEdit.id,
        colors: tempColors,
        category: selectedCategory,
      };

      // Actualizar en el servidor Vendure
      const titleStr = typeof title === 'string' ? title : title.es || title.en || '';
      const descStr = typeof description === 'string' ? description : description.es || description.en || '';
      ProductService.updateProduct({
        id: productToEdit.id!,
        name: titleStr,
        slug: product.slug,
        enabled: product.enabled,
        description: descStr,
        price: Number(price),
        enOfertaFlash: Boolean(product.enOfertaFlash),
        porcentajeDescuento: product.porcentajeDescuento || 0,
        precioAnterior: product.precioAnterior,
      }).catch((err) => console.warn("Aviso al actualizar en Vendure:", err));

      setProducts((prevProducts) =>
        prevProducts.map((currentProduct) =>
          currentProduct.id === productToEdit.id
            ? updatedProduct
            : currentProduct,
        ),
      );

      addToast(
        "success",
        t("users.toasts.updatedTitle", "Product Updated! ✨"),
        t("users.toasts.updatedMsg", {
          name: titleStr,
          defaultValue: `"${titleStr}" has been updated successfully.`,
        }),
      );
    }

    /*
     * CREATE NEW PRODUCT
     */
    else {
      const titleStr = typeof title === 'string' ? title : title.es || title.en || '';
      const descStr = typeof description === 'string' ? description : description.es || description.en || '';
      
      const newProduct: Product = {
        ...product,
        id: uuid(),
        colors: tempColors,
        category: selectedCategory,
      };

      // Crear en el servidor Vendure
      ProductService.createProduct({
        name: titleStr,
        slug: product.slug,
        enabled: product.enabled,
        description: descStr,
        price: Number(price),
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        stock: 20,
        enOfertaFlash: Boolean(product.enOfertaFlash),
        porcentajeDescuento: product.porcentajeDescuento || 0,
        precioAnterior: product.precioAnterior,
        imageURL,
      })
        .then((created) => {
          if (created?.id) {
            setProducts((prev) =>
              prev.map((p) => (p.id === newProduct.id ? { ...p, id: created.id } : p))
            );
          }
        })
        .catch((err) => console.warn("Aviso al crear en Vendure:", err));

      setProducts((prevProducts) => [newProduct, ...prevProducts]);

      addToast(
        "success",
        t("products.productCreated", "Product Created! 🎉"),
        t("products.productCreatedMsg", {
          title: titleStr,
          defaultValue: `"${titleStr}" has been added to the catalog.`,
        }),
      );
    }

    setProduct(defaultProduct);
    setProductToEdit(null);
    settempColors([]);
    setSelectedCategory(categories[0]);
    setErrors({
      title: "",
      description: "",
      imageURL: "",
      price: "",
      colors: "",
    });

    closeModal();
  };

  const onCancelHandler = () => {
    setProduct(defaultProduct);
    setProductToEdit(null);
    settempColors([]);
    setSelectedCategory(categories[0]);

    setErrors({
      title: "",
      description: "",
      imageURL: "",
      price: "",
      colors: "",
    });

    closeModal();
  };

  const removeColorHandler = (color: string) => {
    settempColors((prevColors) =>
      prevColors.filter((prevColor) => prevColor !== color),
    );
  };

  const handleOpenDeleteModal = (productId: string) => {
    if (!productId) return;
    const foundProduct = products.find((p) => p.id === productId);
    if (foundProduct) {
      setProductToDelete(foundProduct);
    }
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;

    const targetId = productToDelete.id;
    const targetTitle = getLocalizedText(
      productToDelete.title,
      i18n.language || "en",
    );

    if (targetId) {
      ProductService.deleteProduct(targetId).catch((err) =>
        console.warn("Aviso al eliminar producto en Vendure:", err)
      );
    }

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== targetId),
    );

    addToast(
      "success",
      t("products.productDeleted", "Product Deleted! 🗑️"),
      t("products.productDeletedMsg", {
        title: targetTitle,
        defaultValue: `"${targetTitle}" has been removed from the catalog.`,
      }),
    );

    setProductToDelete(null);
  };

  /*
   * -------------------------
   * FORM
   * -------------------------
   */

  const renderFormInputs = formInputsList.map((input) => {
    if (input.name === 'imageURL') {
      return (
        <div className="flex flex-col" key={input.id}>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={input.id}
              className="text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-zinc-300"
            >
              {t(`products.inputs.${input.name}`, input.label)}
            </label>
            <button
              type="button"
              onClick={() => setIsAssetPickerOpen(true)}
              className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>🖼️ Galería Cloudflare R2</span>
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={input.type}
                name={input.name}
                id={input.id}
                value={String(product[input.name] || "")}
                onChange={onChangeHandler}
                placeholder="https://... o elige de la galería"
              />
            </div>
            {product.imageURL && (
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={product.imageURL}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <ErrorMessage msg={errors[input.name]} />
        </div>
      );
    }

    return (
      <div className="flex flex-col" key={input.id}>
        <label
          htmlFor={input.id}
          className="mb-1.5 text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-zinc-300"
        >
          {t(`products.inputs.${input.name}`, input.label)}
        </label>

        <Input
          type={input.type}
          name={input.name}
          id={input.id}
          value={String(product[input.name] || "")}
          onChange={onChangeHandler}
        />

        <ErrorMessage msg={errors[input.name]} />
      </div>
    );
  });

  const renderProductColors = colors.map((color) => (
    <ColorCircle
      color={color}
      key={color}
      isSelected={tempColors.includes(color)}
      onClick={() =>
        settempColors((prevColors) => {
          if (prevColors.includes(color)) {
            return prevColors.filter((prevColor) => prevColor !== color);
          }

          return [...prevColors, color];
        })
      }
    />
  ));

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm font-medium text-zinc-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // 1. Rutas públicas accesibles sin autenticación
  if (location.pathname === "/create-store") {
    return <CreateStorePage />;
  }
  if (location.pathname === "/terms") return <TermsPage />;
  if (location.pathname === "/privacy" || location.pathname === "/privacy-policy") return <PrivacyPage />;
  if (location.pathname === "/cookies" || location.pathname === "/cookie-policy") return <CookiesPage />;
  if (location.pathname === "/docs" || location.pathname === "/documentation") return <DocsPage />;
  if (location.pathname === "/api-reference") return <ApiPage />;
  if (location.pathname === "/help-center") return <HelpPage />;

  // 2. Obligatorio: debe iniciar sesión primero para ver o tener cualquier tienda o canal
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Si está autenticado pero aún no tiene ningún canal o tienda activo de su cuenta:
  // APARECE EL DIALOG CON TODOS LOS PROYECTOS CREADOS DESDE ESA CUENTA
  if (!activeChannel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white p-4">
        <ChannelSelectionModal
          isOpen={true}
          isLoginFlow={true}
          onSelectChannel={(ch) => setActiveChannel(ch)}
        />
      </div>
    );
  }

  if (location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return (
    <AIProvider
      products={products}
      setProducts={setProducts}

      addToast={(type, title, msg) =>
        addToast(
          type === "danger" ? "error" : (type as "success" | "error" | "info"),
          title,
          msg || "",
        )
      }
    >
      <div className="relative flex min-h-screen flex-col bg-zinc-50/50 font-sans text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
        <Navbar
          onAddProduct={open}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isCollapsed={sidebarCollapsed}
            setIsCollapsed={setSidebarCollapsed}
          />

          <div className="flex flex-1 flex-col overflow-y-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    {/* View Switcher Bar */}
                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-10 transition-colors">
                      <div className="flex items-center gap-1 rounded-xl bg-zinc-100/80 p-1 dark:bg-zinc-800/80 text-xs font-semibold">
                        <button
                          onClick={() => handleSetMainViewTab('dashboard')}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                            mainViewTab === 'dashboard'
                              ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white font-bold'
                              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                          }`}
                        >
                          <BarChart3 className="h-4 w-4 text-sky-500" />
                          <span>Dashboard Ejecutivo</span>
                        </button>
                        <button
                          onClick={() => handleSetMainViewTab('products')}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                            mainViewTab === 'products'
                              ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white font-bold'
                              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                          }`}
                        >
                          <Box className="h-4 w-4 text-indigo-500" />
                          <span>Catálogo de Productos ({products.length})</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsCommandPaletteOpen(true)}
                          className="hidden md:flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer shadow-2xs"
                        >
                          <Search className="h-3.5 w-3.5" />
                          <span>Comandos</span>
                          <kbd className="rounded bg-zinc-100 px-1 text-[10px] font-mono dark:bg-zinc-700">⌘K</kbd>
                        </button>
                      </div>
                    </div>

                    {mainViewTab === 'dashboard' ? (
                      <DashboardOverview
                        onAddProduct={open}
                        onSwitchToCatalog={() => handleSetMainViewTab('products')}
                      />
                    ) : (
                      <ProductsView
                        open={open}
                        products={products}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filterCategory={filterCategory}
                        setFilterCategory={setFilterCategory}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        setProductToEdit={openEditModal}
                        onDeleteProduct={handleOpenDeleteModal}
                        isLoading={isProductsLoading}
                      />
                    )}
                  </div>
                }
              />

              <Route
                path="/products"
                element={
                  <ProductsView
                    open={open}
                    products={products}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    setProductToEdit={openEditModal}
                    onDeleteProduct={handleOpenDeleteModal}
                    isLoading={isProductsLoading}
                  />
                }
              />

              {/* RUTAS ADAPTADAS DE VENDURE */}
              <Route path="/product-variants" element={<ProductVariantsPage />} />
              <Route path="/facets" element={<FacetsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/flash-sales" element={<CollectionsPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/channels" element={<ChannelsPage />} />
              <Route path="/administrators" element={<AdministratorsPage />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/customer-groups" element={<CustomerGroupsPage />} />
              <Route path="/stock-locations" element={<StockLocationsPage />} />
              <Route path="/taxes" element={<TaxesPage />} />
              <Route path="/zones" element={<ZonesPage />} />
              <Route path="/sellers" element={<SellersPage />} />
              <Route path="/system" element={<SystemHealthPage />} />
              <Route path="/shipping-methods" element={<ShippingMethodsPage />} />
              <Route path="/payment-methods" element={<PaymentMethodsPage />} />
              <Route path="/job-queue" element={<JobQueuePage />} />
              <Route path="/users" element={<Navigate to="/customers" replace />} />
              <Route path="/store-settings" element={<StoreSettingsPage />} />
              <Route path="/builder" element={<Navigate to="/store-settings?tab=builder" replace />} />
              <Route path="/storefront" element={<Navigate to="/store-settings?tab=preview" replace />} />
              <Route path="/preview" element={<Navigate to="/store-settings?tab=preview" replace />} />
              <Route path="/create-store" element={<CreateStorePage />} />
              <Route path="/alegra" element={<AlegraPage />} />

              <Route
                path="/settings"
                element={
                  <SettingsPage
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    addToast={addToast}
                  />
                }
              />

              <Route path="/docs" element={<DocsPage />} />
              <Route path="/documentation" element={<DocsPage />} />
              <Route path="/api-reference" element={<ApiPage />} />
              <Route path="/help-center" element={<HelpPage />} />
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookie-policy" element={<CookiesPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
            </Routes>

            <Footer />
          </div>
        </div>

        <Toast toasts={toasts} onDismiss={dismissToast} />

        {/* Floating AI Assistant Button & Chat Panel */}
        <FloatingAIButton />
        <AIChatPanel />

        {/* Add & Edit Product Modal */}
        <Modal
          isOpen={isOpen}
          closeModal={closeModal}
          title={
            productToEdit
              ? `Producto: ${getLocalizedText(productToEdit.title, currentLang)}`
              : t("products.addModalTitle", "Add A New Product")
          }
        >
          {/* Tabs Selector */}
          <div className="mb-4 flex flex-wrap items-center gap-1 border-b border-zinc-200 pb-2 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveModalTab('general')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeModalTab === 'general'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              📌 General
            </button>
            <button
              type="button"
              onClick={() => setActiveModalTab('variants')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeModalTab === 'variants'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              🔀 Variantes ({productToEdit?.variants?.length || 1})
            </button>
            <button
              type="button"
              onClick={() => setActiveModalTab('facets')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeModalTab === 'facets'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              🏷️ Facetas & Atributos
            </button>
            <button
              type="button"
              onClick={() => setActiveModalTab('flash')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeModalTab === 'flash'
                  ? 'bg-amber-500 text-white'
                  : 'text-zinc-500 hover:text-amber-500'
              }`}
            >
              ⚡ Oferta Flash
            </button>
          </div>

          {activeModalTab === 'general' && (
            <form className="flex flex-col gap-y-3" onSubmit={onSubmitHandler}>
              {renderFormInputs}

              <Select
                label={t("products.inputs.category", "Category")}
                options={categories.map((cat) => ({
                  value: cat.name,
                  label: t(`categories.${cat.name.toLowerCase()}`, cat.name),
                  imageURL: cat.imageURL,
                }))}
                value={selectedCategory.name}
                onChange={(val: string) => {
                  const matched = categories.find((c) => c.name === val);
                  if (matched) {
                    setSelectedCategory(matched);
                  }
                }}
              />

              <div className="flex flex-wrap items-center justify-center gap-2 py-1">
                {renderProductColors}
              </div>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  tempColors.length > 0
                    ? "mt-1 grid-rows-[1fr] opacity-100"
                    : "mt-0 grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="flex flex-wrap items-center justify-center gap-1.5 py-1.5">
                    {tempColors.map((color) => (
                      <span
                        key={color}
                        className="inline-flex cursor-pointer items-center gap-x-1 rounded-md px-2.5 py-1 text-xs font-medium text-white shadow-xs transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
                        style={{ backgroundColor: color }}
                        onClick={() => removeColorHandler(color)}
                      >
                        {color}
                        <span className="ms-0.5 text-[10px] font-bold opacity-75 hover:opacity-100">
                          ×
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <ErrorMessage msg={errors.colors} />

              {/* Slug / SEO y Estado de Publicación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-zinc-300">
                      Slug SEO / URL
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const titleStr = typeof product.title === 'string' ? product.title : getLocalizedText(product.title, currentLang);
                        const autoSlug = titleStr.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                        setProduct(prev => ({ ...prev, slug: autoSlug }));
                      }}
                      className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold hover:underline"
                    >
                      Generar de título ⚡
                    </button>
                  </div>
                  <input
                    type="text"
                    value={product.slug || ''}
                    placeholder="ej: playera-deportiva-algodon"
                    onChange={(e) => setProduct(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-mono shadow-xs focus:border-zinc-900 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-100"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="mb-1.5 text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-zinc-300">
                    Estado en Tienda
                  </label>
                  <button
                    type="button"
                    onClick={() => setProduct(prev => ({ ...prev, enabled: prev.enabled === false ? true : false }))}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-xs font-bold transition border ${
                      product.enabled !== false
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-zinc-100 text-zinc-500 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                    }`}
                  >
                    <span>{product.enabled !== false ? '🟢 Publicado (Activo)' : '⚪ Borrador (Oculto)'}</span>
                    <span className="text-[10px] uppercase tracking-wider font-mono">
                      {product.enabled !== false ? 'Visible' : 'Oculto'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-x-3 pt-2">
                <Button
                  className="border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  type="button"
                  onClick={onCancelHandler}
                >
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button className="bg-zinc-900 font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:text-white">
                  {productToEdit ? t("common.update", "Update") : t("common.submit", "Submit")}
                </Button>
              </div>
            </form>
          )}

          {activeModalTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                    Variantes Registradas
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    Total: {productToEdit?.variants?.length || 1} variantes
                  </span>
                </div>
                {productToEdit?.id && (
                  <button
                    type="button"
                    onClick={() => setIsVariantGenOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-sky-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-sky-500 hover:to-indigo-500 transition"
                  >
                    ⚡ Generador Masivo (Matriz)
                  </button>
                )}
              </div>

              <div className="divide-y divide-zinc-200/80 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/50 overflow-hidden">
                {(productToEdit?.variants && productToEdit.variants.length > 0) ? (
                  productToEdit.variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between p-3 text-xs">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">{v.name}</p>
                        <p className="font-mono text-[11px] text-zinc-400">SKU: {v.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-zinc-900 dark:text-white">
                          ${(v.price / 100).toFixed(2)}
                        </p>
                        <p className="text-[11px] text-emerald-500 font-semibold">
                          {v.stockOnHand} uds disponibles
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-xs text-zinc-500">
                    Variante predeterminada: <strong>{product.title ? getLocalizedText(product.title, currentLang) : 'Variante estándar'}</strong> (${product.price})
                  </div>
                )}
              </div>

              {productToEdit?.id && (
                <form onSubmit={handleAddVariantToProduct} className="rounded-xl border border-dashed border-zinc-300 p-3 dark:border-zinc-700 bg-white dark:bg-zinc-900 space-y-3">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">
                    + Añadir Nueva Variante a este Producto
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Nombre (ej: 15 inch 16GB)"
                      value={newVarName}
                      onChange={(e) => setNewVarName(e.target.value)}
                      className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="SKU (opcional)"
                      value={newVarSku}
                      onChange={(e) => setNewVarSku(e.target.value)}
                      className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-mono dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="Precio ($)"
                      value={newVarPrice}
                      onChange={(e) => setNewVarPrice(e.target.value)}
                      className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Stock"
                      value={newVarStock}
                      onChange={(e) => setNewVarStock(e.target.value)}
                      className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAddingVariant}
                    className="w-full rounded-lg bg-sky-600 py-1.5 text-xs font-bold text-white hover:bg-sky-500 disabled:opacity-50"
                  >
                    {isAddingVariant ? 'Creando en Vendure...' : 'Guardar Variante'}
                  </button>
                </form>
              )}
            </div>
          )}

          {activeModalTab === 'facets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                    Facetas Asignadas al Producto
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Las facetas permiten a los clientes filtrar por marca, color, especificaciones y categorías.
                  </p>
                </div>
                {productToEdit?.id && (
                  <button
                    type="button"
                    onClick={() => setIsAssignFacetsOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition cursor-pointer"
                  >
                    🏷️ Asignar Facetas
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 py-2">
                {productToEdit?.facetValues && productToEdit.facetValues.length > 0 ? (
                  productToEdit.facetValues.map((fv) => (
                    <span
                      key={fv.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500"
                    >
                      <span>🏷️ {fv.name}</span>
                      <span className="font-mono text-[10px] opacity-75">#{fv.code}</span>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    Este producto no tiene facetas asignadas aún. Puedes administrar todas las facetas globales desde el menú lateral en "Facetas & Filtros".
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-zinc-200 p-3.5 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40">
                <p className="text-xs font-bold text-zinc-900 dark:text-white">
                  💡 Sugerencia de Catálogo Vendure
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Para crear nuevas dimensiones de filtro (como tallas, telas o colecciones comerciales), ve a la sección <strong>Facetas & Filtros</strong> en el menú lateral.
                </p>
              </div>
            </div>
          )}

          {activeModalTab === 'flash' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <div>
                      <h4 className="text-sm font-bold text-amber-500 dark:text-amber-400">
                        Oferta Flash & Descuento
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Incluye automáticamente el producto en la colección de Ofertas Flash con temporizador.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={Boolean(product.enOfertaFlash)}
                      onChange={(e) => {
                        const active = e.target.checked;
                        setProduct((prev) => ({
                          ...prev,
                          enOfertaFlash: active,
                          porcentajeDescuento: active ? prev.porcentajeDescuento || 15 : 0,
                        }));
                      }}
                      className="peer sr-only"
                    />
                    <div className="peer h-5 w-9 rounded-full bg-zinc-300 peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all dark:bg-zinc-700"></div>
                  </label>
                </div>

                {product.enOfertaFlash && (
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-amber-500/20 pt-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Precio Anterior / Tachado ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Ej: 50.00"
                        value={
                          product.precioAnterior
                            ? (product.precioAnterior / 100).toString()
                            : ""
                        }
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          const cents = isNaN(val) ? undefined : Math.round(val * 100);
                          const currentPriceNum = parseFloat(product.price) || 0;
                          let discountPercent = product.porcentajeDescuento || 0;
                          if (val > currentPriceNum && val > 0) {
                            discountPercent = Math.round(((val - currentPriceNum) / val) * 100);
                          }
                          setProduct((prev) => ({
                            ...prev,
                            precioAnterior: cents,
                            porcentajeDescuento: discountPercent,
                          }));
                        }}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Descuento Calculado (%)
                      </label>
                      <div className="flex h-8 items-center rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 text-xs font-bold text-amber-500 dark:text-amber-400">
                        ⚡ -{product.porcentajeDescuento || 0}% OFF
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  className="bg-zinc-900 font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                  onClick={onSubmitHandler as any}
                >
                  Guardar Promoción Flash
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Matrix Variant Generator Modal */}
        <VariantGeneratorModal
          isOpen={isVariantGenOpen}
          onClose={() => setIsVariantGenOpen(false)}
          defaultProductId={productToEdit?.id}
          onSuccess={() => {
            setIsVariantGenOpen(false);
            window.dispatchEvent(new Event("channel-changed"));
          }}
        />

        {/* Cloudflare R2 Asset Picker Dialog */}
        <AssetPickerDialog
          isOpen={isAssetPickerOpen}
          onClose={() => setIsAssetPickerOpen(false)}
          currentImageUrl={product.imageURL}
          onSelectAsset={(url) => {
            setProduct((prev) => ({ ...prev, imageURL: url }));
          }}
        />

        {/* Assign Facet Values Modal */}
        <AssignFacetValuesModal
          isOpen={isAssignFacetsOpen}
          onClose={() => setIsAssignFacetsOpen(false)}
          productId={productToEdit?.id}
          productName={productToEdit ? getLocalizedText(productToEdit.title, currentLang) : ''}
          initialFacetValueIds={productToEdit?.facetValues?.map((f) => f.id) || []}
          onSuccess={() => {
            setIsAssignFacetsOpen(false);
            window.dispatchEvent(new Event("channel-changed"));
          }}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!productToDelete}
          closeModal={() => setProductToDelete(null)}
          title={t("products.delete", "DELETE")}
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
              {t("products.deleteConfirmation", {
                title: productToDelete
                  ? getLocalizedText(productToDelete.title, currentLang)
                  : "",
                defaultValue: `Are you sure you want to remove "${
                  productToDelete
                    ? getLocalizedText(productToDelete.title, currentLang)
                    : ""
                }" from the catalog?`,
              })}
            </p>

            <div className="flex items-center justify-end gap-x-3 pt-2">
              <Button
                type="button"
                className="border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                onClick={() => setProductToDelete(null)}
              >
                {t("common.cancel", "Cancel")}
              </Button>

              <Button
                type="button"
                className="bg-rose-600 font-semibold text-white shadow-xs hover:bg-rose-700"
                onClick={handleConfirmDelete}
              >
                {t("products.delete", "DELETE")}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Global Command Palette (Ctrl+K / Cmd+K) */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onAddProduct={open}
          onToggleTheme={toggleDarkMode}
          darkMode={darkMode}
        />
      </div>
    </AIProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
