(function () {
    function safeParse(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function loadCart() {
        const cart = safeParse('floraCart', []);
        return Array.isArray(cart) ? cart : [];
    }

    function saveCart(cart) {
        localStorage.setItem('floraCart', JSON.stringify(Array.isArray(cart) ? cart : []));
    }

    function getTotals(cart) {
        const normalized = Array.isArray(cart) ? cart : [];
        const subtotal = normalized.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
        const delivery = subtotal > 25 ? 0 : 5;
        return {
            subtotal,
            delivery,
            total: subtotal + delivery
        };
    }

    function saveOrder(orderInput) {
        const cart = Array.isArray(orderInput.cart) ? orderInput.cart : [];
        const deliveryInfo = orderInput.deliveryInfo || {};
        const paymentMethod = orderInput.paymentMethod || 'cashOnDelivery';
        const totals = getTotals(cart);
        const id = Date.now();

        const orderData = {
            id,
            orderId: 'ORD-' + id,
            date: new Date().toLocaleString(),
            items: [...cart],
            customer: {
                name: deliveryInfo.name || '',
                phone: deliveryInfo.phone || '',
                address: deliveryInfo.address || '',
                city: deliveryInfo.city || '',
                postal: deliveryInfo.postal || ''
            },
            paymentMethod,
            subtotal: totals.subtotal.toFixed(2),
            delivery: totals.delivery,
            total: totals.total.toFixed(2),
            status: 'Confirmed'
        };

        const floraOrders = safeParse('floraOrders', []);
        floraOrders.push(orderData);
        localStorage.setItem('floraOrders', JSON.stringify(floraOrders));

        const currentUser = safeParse('currentUser', null);
        if (currentUser && currentUser.username) {
            const userOrders = safeParse('userOrders', {});
            if (!Array.isArray(userOrders[currentUser.username])) {
                userOrders[currentUser.username] = [];
            }

            userOrders[currentUser.username].push({
                orderId: orderData.orderId,
                date: orderData.date,
                items: orderData.items,
                subtotal: Number(orderData.subtotal),
                delivery: orderData.delivery,
                total: orderData.total,
                deliveryAddress: orderData.customer.address,
                deliveryPhone: orderData.customer.phone,
                deliveryName: orderData.customer.name,
                deliveryCity: orderData.customer.city,
                deliveryPostal: orderData.customer.postal,
                paymentMethod: orderData.paymentMethod,
                status: orderData.status
            });

            localStorage.setItem('userOrders', JSON.stringify(userOrders));
        }

        return {
            orderId: orderData.orderId,
            subtotal: totals.subtotal,
            delivery: totals.delivery,
            total: totals.total
        };
    }

    function updateCartBadge(badgeId, count) {
        const badge = document.getElementById(badgeId || 'cartCount');
        if (badge) {
            badge.textContent = String(Number(count) || 0);
        }
    }

    window.FloraSharedCommerce = {
        loadCart,
        saveCart,
        getTotals,
        saveOrder,
        updateCartBadge
    };
})();
