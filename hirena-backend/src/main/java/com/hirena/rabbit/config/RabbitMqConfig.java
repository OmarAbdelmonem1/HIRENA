package com.hirena.rabbit.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.config.RetryInterceptorBuilder;

@Configuration
public class RabbitMqConfig {

    @Bean
    public DirectExchange applicationEventsExchange(
            @Value("${rabbitmq.exchange.application-events}") String exchangeName) {
        return new DirectExchange(exchangeName, true, false);
    }

    @Bean
    public DirectExchange applicationEventsDeadLetterExchange(
            @Value("${rabbitmq.exchange.dead-letter}") String exchangeName) {
        return new DirectExchange(exchangeName, true, false);
    }

    @Bean
    public Queue notificationApplicationCreatedQueue(
            @Value("${rabbitmq.queue.application-created.notification}") String queueName,
            @Value("${rabbitmq.exchange.dead-letter}") String deadLetterExchange) {
        return durableQueue(queueName, deadLetterExchange);
    }

    @Bean
    public Queue geminiApplicationCreatedQueue(
            @Value("${rabbitmq.queue.application-created.gemini}") String queueName,
            @Value("${rabbitmq.exchange.dead-letter}") String deadLetterExchange) {
        return durableQueue(queueName, deadLetterExchange);
    }

    @Bean
    public Queue emailApplicationCreatedQueue(
            @Value("${rabbitmq.queue.application-created.email}") String queueName,
            @Value("${rabbitmq.exchange.dead-letter}") String deadLetterExchange) {
        return durableQueue(queueName, deadLetterExchange);
    }

    @Bean
    public Queue notificationApplicationCreatedDeadLetterQueue(
            @Value("${rabbitmq.queue.application-created.notification}") String queueName) {
        return QueueBuilder.durable(deadLetterQueueName(queueName)).build();
    }

    @Bean
    public Queue geminiApplicationCreatedDeadLetterQueue(
            @Value("${rabbitmq.queue.application-created.gemini}") String queueName) {
        return QueueBuilder.durable(deadLetterQueueName(queueName)).build();
    }

    @Bean
    public Queue emailApplicationCreatedDeadLetterQueue(
            @Value("${rabbitmq.queue.application-created.email}") String queueName) {
        return QueueBuilder.durable(deadLetterQueueName(queueName)).build();
    }

    @Bean
    public Binding notificationApplicationCreatedBinding(
            @Qualifier("notificationApplicationCreatedQueue") Queue notificationApplicationCreatedQueue,
            @Qualifier("applicationEventsExchange") DirectExchange applicationEventsExchange,
            @Value("${rabbitmq.routing-key.application-created}") String routingKey) {
        return BindingBuilder.bind(notificationApplicationCreatedQueue)
                .to(applicationEventsExchange).with(routingKey);
    }

    @Bean
    public Binding geminiApplicationCreatedBinding(
            @Qualifier("geminiApplicationCreatedQueue") Queue geminiApplicationCreatedQueue,
            @Qualifier("applicationEventsExchange") DirectExchange applicationEventsExchange,
            @Value("${rabbitmq.routing-key.application-created}") String routingKey) {
        return BindingBuilder.bind(geminiApplicationCreatedQueue)
                .to(applicationEventsExchange).with(routingKey);
    }

    @Bean
    public Binding emailApplicationCreatedBinding(
            @Qualifier("emailApplicationCreatedQueue") Queue emailApplicationCreatedQueue,
            @Qualifier("applicationEventsExchange") DirectExchange applicationEventsExchange,
            @Value("${rabbitmq.routing-key.application-created}") String routingKey) {
        return BindingBuilder.bind(emailApplicationCreatedQueue)
                .to(applicationEventsExchange).with(routingKey);
    }

    @Bean
    public Binding notificationApplicationCreatedDeadLetterBinding(
            @Qualifier("notificationApplicationCreatedDeadLetterQueue") Queue notificationApplicationCreatedDeadLetterQueue,
            @Qualifier("applicationEventsDeadLetterExchange") DirectExchange applicationEventsDeadLetterExchange,
            @Value("${rabbitmq.queue.application-created.notification}") String queueName) {
        return deadLetterBinding(notificationApplicationCreatedDeadLetterQueue,
                applicationEventsDeadLetterExchange, queueName);
    }

    @Bean
    public Binding geminiApplicationCreatedDeadLetterBinding(
            @Qualifier("geminiApplicationCreatedDeadLetterQueue") Queue geminiApplicationCreatedDeadLetterQueue,
            @Qualifier("applicationEventsDeadLetterExchange") DirectExchange applicationEventsDeadLetterExchange,
            @Value("${rabbitmq.queue.application-created.gemini}") String queueName) {
        return deadLetterBinding(geminiApplicationCreatedDeadLetterQueue,
                applicationEventsDeadLetterExchange, queueName);
    }

    @Bean
    public Binding emailApplicationCreatedDeadLetterBinding(
            @Qualifier("emailApplicationCreatedDeadLetterQueue") Queue emailApplicationCreatedDeadLetterQueue,
            @Qualifier("applicationEventsDeadLetterExchange") DirectExchange applicationEventsDeadLetterExchange,
            @Value("${rabbitmq.queue.application-created.email}") String queueName) {
        return deadLetterBinding(emailApplicationCreatedDeadLetterQueue,
                applicationEventsDeadLetterExchange, queueName);
    }

    @Bean
    public MessageConverter rabbitMessageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            MessageConverter rabbitMessageConverter,
            @Value("${rabbitmq.consumer.retry-attempts:3}") int retryAttempts,
            @Value("${rabbitmq.consumer.retry-backoff-ms:1000}") long retryBackoffMs) {
        var retryInterceptor = RetryInterceptorBuilder.stateless()
                .maxRetries(Math.max(0, retryAttempts - 1))
                .backOffOptions(retryBackoffMs, 1.0, retryBackoffMs)
                .recoverer(new RejectAndDontRequeueRecoverer())
                .build();
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(rabbitMessageConverter);
        factory.setAdviceChain(retryInterceptor);
        factory.setDefaultRequeueRejected(false);
        return factory;
    }

    private Queue durableQueue(String queueName, String deadLetterExchange) {
        return QueueBuilder.durable(queueName)
                .deadLetterExchange(deadLetterExchange)
                .deadLetterRoutingKey(deadLetterQueueName(queueName))
                .build();
    }

    private String deadLetterQueueName(String queueName) {
        return queueName + ".dead";
    }

    private Binding deadLetterBinding(Queue deadLetterQueue,
                                      DirectExchange deadLetterExchange,
                                      String sourceQueueName) {
        return BindingBuilder.bind(deadLetterQueue)
                .to(deadLetterExchange)
                .with(deadLetterQueueName(sourceQueueName));
    }
}
