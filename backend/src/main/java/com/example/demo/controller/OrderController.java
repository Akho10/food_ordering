package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Order;
import com.example.demo.entity.Product;
import com.example.demo.service.OrderService;
import com.example.demo.service.ProductService;

@CrossOrigin(origins="http://localhost:4200")
@RestController
@RequestMapping ("api/orders")
public class OrderController {
	
	@Autowired
	private OrderService orderService ;

	// getAll
	@GetMapping("/list")
	public List<Order> getAllOrders() {
		return orderService.getAllOrders();
	}

	// findById
	@GetMapping("/list/{id}")
	public Order findOrderById(@PathVariable Long id) {
		return orderService.findOrderById(id);
	}

	// add
	@PostMapping("/add")
	public Order addOrder(@RequestBody Order order) {
		return orderService.addOrder(order);
	}

}
