# Test Report (TESTS.md)

## 1. Unit Tests (Audit Engine)
We used **Vitest** to verify the core math behind the `lib/audit-engine.ts`.

### Test 1: Single Tool Optimization
* **Input**: ChatGPT Plus ($20/mo)
* **Expected**: Optimized Status (No savings)
* **Result**: ✅ PASS

### Test 2: Multi-Tool Redundancy
* **Input**: ChatGPT Plus ($20/mo) + Claude Pro ($20/mo)
* **Expected**: $20 Monthly Saving (Consolidate to Claude)
* **Result**: ✅ PASS

### Test 3: API Tier Scaling
* **Input**: OpenAI API ($500/mo)
* **Expected**: Suggest Anthropic API (for specific high-volume logic)
* **Result**: ✅ PASS

## 2. Integration Tests (API Routes)

### Test 4: Lead Capture (POST /api/save-audit)
* **Scenario**: Valid email + results submitted.
* **Expected**: 200 OK + UUID shareId returned.
* **Result**: ✅ PASS

### Test 5: Dynamic Routing (GET /audit/[id])
* **Scenario**: Accessing a saved audit via UUID.
* **Expected**: Metadata correctly populated for social sharing.
* **Result**: ✅ PASS

## 3. UI/UX Verification

### Test 6: Mobile Responsiveness
* **Scenario**: Adding 5 tools on an iPhone 13 viewport.
* **Expected**: No horizontal scroll; inputs remain accessible.
* **Result**: ✅ PASS

### Test 7: Form Persistence
* **Scenario**: Refreshing page after adding 3 tools.
* **Expected**: Zustand store retains tools.
* **Result**: ✅ PASS
