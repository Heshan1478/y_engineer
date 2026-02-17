package com.example.y_eng_backend.service;

import com.example.y_eng_backend.entity.CartItem;
import com.example.y_eng_backend.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getUserCart(UUID userId) {
        return cartItemRepository.findByUserId(userId);
    }

    @Transactional
    public CartItem addToCart(UUID userId, Long productId, Integer quantity) {
        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(userId, productId);

        if (existing.isPresent()) {
            // Update quantity if item already in cart
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            // Add new item to cart
            CartItem item = new CartItem();
            item.setUserId(userId);
            item.setProductId(productId);
            item.setQuantity(quantity);
            return cartItemRepository.save(item);
        }
    }

    @Transactional
    public CartItem updateCartItem(Long cartItemId, Integer quantity) {
        Optional<CartItem> optionalItem = cartItemRepository.findById(cartItemId);
        if (optionalItem.isPresent()) {
            CartItem item = optionalItem.get();
            item.setQuantity(quantity);
            return cartItemRepository.save(item);
        }
        throw new RuntimeException("Cart item not found");
    }

    @Transactional
    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(UUID userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}