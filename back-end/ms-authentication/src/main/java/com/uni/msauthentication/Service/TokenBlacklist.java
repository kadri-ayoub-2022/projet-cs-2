package com.uni.msauthentication.Service;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class TokenBlacklist {

    private final Map<String, Long> blacklist = new HashMap<>();

    public void blacklistToken(String token, long expiration) {
        blacklist.put(token, expiration);
    }

    public boolean isBlacklisted(String token) {
        blacklist.entrySet().removeIf(entry -> entry.getValue() <= System.currentTimeMillis());
        return blacklist.containsKey(token);
    }
}
