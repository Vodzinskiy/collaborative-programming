package vodzinskiy.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import vodzinskiy.backend.model.User;
import vodzinskiy.backend.repository.UserRepository;

import java.util.Optional;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final Logger logger = Logger.getLogger(this.getClass().getName());
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        processOAuth2User(oAuth2User);
        return oAuth2User;
    }

    private void processOAuth2User(OAuth2User oAuth2User) {
        logger.info("User attributes: " + oAuth2User.getAttributes());
        String username = Optional.ofNullable(oAuth2User.getAttributes().get("name"))
                .map(Object::toString)
                .orElse(oAuth2User.getAttributes().get("login").toString());
        String email = Optional.ofNullable(oAuth2User.getAttributes().get("email"))
                .map(Object::toString)
                .orElse(null);
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            User user = new User(username, email);
            userRepository.save(user);
        }
    }
}
