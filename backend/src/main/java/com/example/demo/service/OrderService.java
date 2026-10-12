package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Order;
import com.example.demo.entity.Payment;
import com.example.demo.entity.Product;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

	@Autowired
	private OrderRepository orderRepository;
	
	@Autowired
	private ProductService productService;
	
	@Autowired
	private PaymentService paymentService;
	
	//getAll
	public List<Order> getAllOrders(){
		return orderRepository.findAll();
	}
	//findById
	public Order findOrderById(Long id){
		return orderRepository.findById(id).orElseThrow();
	}
	//add
	@Transactional
	public Order addOrder(Order order){
		Product product = productService.findProductById(order.getProduct().getId());
		productService.reduceQuantity(order.getProduct().getId(), order.getQuantity());
		double total = product.getPrice() * order.getQuantity();
		order.setTotal(total);
		order.setStatus("PAID");
		
		Order savedOrder = orderRepository.save(order);
		
		Payment pay = new Payment();
		pay.setOrder(savedOrder);
		pay.setAmount(total);
		
		paymentService.processPayment(pay);
		
		return savedOrder;
	}
}