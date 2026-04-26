def get_high_spend_categories(usage_data: list) -> list:
    return ["Supplies"] if any([i for i in usage_data if i.get('unitCost', 0) > 50]) else []

def suggest_tasks(usage_data: list) -> list:
    suggestions = []
    low_items = [i for i in usage_data if i.get('quantity', 1) <= i.get('threshold', 1)]
    if low_items:
        suggestions.append(f"Restock {len(low_items)} low inventory items")
    high_expense_cats = get_high_spend_categories(usage_data)
    for cat in high_expense_cats:
        suggestions.append(f"Review spending in {cat} category")
    if not suggestions:
        suggestions.append("All items are well stocked")
    return suggestions

def predict_low_inventory(usage_data: list) -> list:
    at_risk = []
    for item in usage_data:
        qty = item.get('quantity', 0)
        threshold = item.get('threshold', 1)
        if qty <= threshold * 1.5:
            at_risk.append(item.get('itemName', 'Unknown item'))
    return at_risk if at_risk else ["No items at risk"]