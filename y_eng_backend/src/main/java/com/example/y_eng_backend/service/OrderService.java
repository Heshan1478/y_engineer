package com.example.y_eng_backend.service;

import com.example.y_eng_backend.entity.CartItem;
import com.example.y_eng_backend.entity.Order;
import com.example.y_eng_backend.entity.OrderItem;
import com.example.y_eng_backend.repository.OrderRepository;
import com.example.y_eng_backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartService cartService;

    public List<Order> getUserOrders(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order createOrder(Order order, List<CartItem> cartItems) {
        // Generate order number
        String orderNumber = generateOrderNumber();
        order.setOrderNumber(orderNumber);

        // Save order first
        Order savedOrder = orderRepository.save(order);

        // Create order items from cart
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getId());
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(cartItem.getProduct().getPrice());
            orderItemRepository.save(orderItem);
        }

        // Clear user's cart
        cartService.clearCart(order.getUserId());

        // Return order with items
        return orderRepository.findById(savedOrder.getId()).get();
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setStatus(status);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found");
    }

    private String generateOrderNumber() {
        LocalDate today = LocalDate.now();
        String dateStr = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(o -> o.getOrderNumber().contains(dateStr))
                .count();
        return String.format("YE-%s-%04d", dateStr, count + 1);
    }
}