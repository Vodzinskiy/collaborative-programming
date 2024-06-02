package vodzinskiy.backend.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import vodzinskiy.backend.models.User;
import vodzinskiy.backend.repositories.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        processOAuth2User(oAuth2User);
        return oAuth2User;
    }

    private void processOAuth2User(OAuth2User oAuth2User) {
        String username = Optional.ofNullable(oAuth2User.getAttributes().get("name"))
                .map(Object::toString)
                .orElseGet(() -> oAuth2User.getAttributes().get("login").toString());
        String email = Optional.ofNullable(oAuth2User.getAttributes().get("email"))
                .map(Object::toString)
                .orElse(null);
        Optional<User> optionalUser = userRepository.findByProviderId(oAuth2User.getName());
        if (optionalUser.isEmpty()) {
            User user = new User(username, email, null, oAuth2User.getName());
            userRepository.save(user);
        }
    }
}
