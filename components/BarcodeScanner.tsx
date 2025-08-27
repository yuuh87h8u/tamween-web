import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X, Scan, ShoppingCart } from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

interface BarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
}

export default function BarcodeScanner({ visible, onClose, onBarcodeScanned }: BarcodeScannerProps) {
  const { theme, userData } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const isArabic = userData.language === 'ar';

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    console.log('Real barcode scanned:', { type, data });
    
    // Process the real barcode data
    processBarcode(data, type);
    
    // Reset after a short delay
    setTimeout(() => {
      setScanned(false);
    }, 2000);
  };

  const processBarcode = async (barcode: string, type: string) => {
    try {
      console.log('Processing barcode:', barcode, 'Type:', type);
      
      // First try OpenFoodFacts API
      const openFoodResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const openFoodData = await openFoodResponse.json();
      
      if (openFoodData.status === 1 && openFoodData.product) {
        const product = openFoodData.product;
        const productInfo = {
          barcode,
          name: product.product_name || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          image: product.image_url,
          category: product.categories,
          ingredients: product.ingredients_text,
          nutrition: product.nutriments,
          source: 'openfoodfacts'
        };
        
        console.log('Product found in OpenFoodFacts:', productInfo);
        onBarcodeScanned(JSON.stringify(productInfo));
        return;
      }
      
      // If not found in OpenFoodFacts, try Barcode Lookup API
      try {
        const barcodeResponse = await fetch(`https://api.barcodelookup.com/v3/products?barcode=${barcode}&formatted=y&key=demo`);
        const barcodeData = await barcodeResponse.json();
        
        if (barcodeData.products && barcodeData.products.length > 0) {
          const product = barcodeData.products[0];
          const productInfo = {
            barcode,
            name: product.title || product.product_name || 'Product Found',
            brand: product.brand || product.manufacturer || 'Unknown Brand',
            image: product.images?.[0],
            description: product.description,
            category: product.category,
            source: 'barcode_lookup'
          };
          
          console.log('Product found in Barcode Lookup:', productInfo);
          onBarcodeScanned(JSON.stringify(productInfo));
          return;
        }
      } catch (barcodeError) {
        console.log('Barcode Lookup API error:', barcodeError);
      }
      
      // Try UPC Database API as another fallback
      try {
        const upcResponse = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
        const upcData = await upcResponse.json();
        
        if (upcData.code === 'OK' && upcData.items && upcData.items.length > 0) {
          const item = upcData.items[0];
          const productInfo = {
            barcode,
            name: item.title || 'Product Found',
            brand: item.brand || 'Unknown Brand',
            image: item.images && item.images.length > 0 ? item.images[0] : null,
            category: item.category,
            source: 'upcitemdb'
          };
          
          console.log('Product found in UPC Database:', productInfo);
          onBarcodeScanned(JSON.stringify(productInfo));
          return;
        }
      } catch (upcError) {
        console.log('UPC Database API not available, using final fallback');
      }
      
      // Enhanced fallback with Google Places API for nearby stores
      try {
        const nearbyStoresResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
          `location=26.2285,50.5860&` + // Bahrain coordinates
          `radius=10000&` +
          `type=grocery_or_supermarket&` +
          `key=AIzaSyDofcXNYF9JkQAKcLd2IGbyzv9IPSD079s`
        );
        const storesData = await nearbyStoresResponse.json();
        
        const fallbackInfo = {
          barcode,
          name: 'Product Not Found',
          message: isArabic ? 'المنتج غير موجود في قاعدة البيانات' : 'Product not found in database',
          type,
          nearbyStores: storesData.results?.slice(0, 3).map((store: any) => ({
            name: store.name,
            address: store.vicinity,
            rating: store.rating,
            isOpen: store.opening_hours?.open_now
          })) || [],
          source: 'fallback_with_stores'
        };
        
        onBarcodeScanned(JSON.stringify(fallbackInfo));
        return;
      } catch (storeError) {
        console.log('Google Places API error:', storeError);
      }
      
      // Final fallback - product not found in any database
      const fallbackInfo = {
        barcode,
        name: 'Product Not Found',
        message: isArabic ? 'المنتج غير موجود في قاعدة البيانات' : 'Product not found in database',
        type,
        source: 'fallback'
      };
      onBarcodeScanned(JSON.stringify(fallbackInfo));
      
    } catch (error) {
      console.error('Error looking up product:', error);
      // Final error fallback
      const basicInfo = {
        barcode,
        type,
        message: isArabic ? 'تم مسح الباركود بنجاح' : 'Barcode scanned successfully',
        source: 'error_fallback'
      };
      onBarcodeScanned(JSON.stringify(basicInfo));
    }
  };

  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.message, { color: theme.text }]}>
            {isArabic ? 'جاري التحقق من الأذونات...' : 'Checking permissions...'}
          </Text>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.permissionContainer}>
            <Scan size={64} color={theme.primary} />
            <Text style={[styles.permissionTitle, { color: theme.text }]}>
              {isArabic ? 'إذن الكاميرا مطلوب' : 'Camera Permission Required'}
            </Text>
            <Text style={[styles.permissionMessage, { color: theme.textSecondary }]}>
              {isArabic 
                ? 'نحتاج إلى إذن الكاميرا لمسح الباركود'
                : 'We need camera permission to scan barcodes'
              }
            </Text>
            <TouchableOpacity
              style={[styles.permissionButton, { backgroundColor: theme.primary }]}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>
                {isArabic ? 'منح الإذن' : 'Grant Permission'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.surface }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text }]}>
                {isArabic ? 'إلغاء' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.cameraContainer}>
        {Platform.OS !== 'web' ? (
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.header}>
                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                  onPress={onClose}
                >
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.scanArea}>
                <View style={styles.scanFrame}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
                
                <Text style={styles.scanText}>
                  {scanned
                    ? (isArabic ? 'تم المسح!' : 'Scanned!')
                    : (isArabic ? 'وجه الكاميرا نحو الباركود' : 'Point camera at barcode')
                  }
                </Text>
              </View>
              
              <View style={styles.footer}>
                <View style={styles.instructionContainer}>
                  <ShoppingCart size={20} color="#FFFFFF" />
                  <Text style={styles.instructionText}>
                    {isArabic 
                      ? 'امسح الباركود لمقارنة الأسعار'
                      : 'Scan barcode to compare prices'
                    }
                  </Text>
                </View>
              </View>
            </View>
          </CameraView>
        ) : (
          <View style={[styles.webFallback, { backgroundColor: theme.background }]}>
            <Scan size={64} color={theme.primary} />
            <Text style={[styles.webFallbackText, { color: theme.text }]}>
              {isArabic 
                ? 'مسح الباركود غير متاح على الويب'
                : 'Barcode scanning not available on web'
              }
            </Text>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.primary }]}
              onPress={onClose}
            >
              <Text style={styles.permissionButtonText}>
                {isArabic ? 'إغلاق' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  permissionContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  footer: {
    padding: 20,
    paddingBottom: 60,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
    textAlign: 'center',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webFallbackText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
});