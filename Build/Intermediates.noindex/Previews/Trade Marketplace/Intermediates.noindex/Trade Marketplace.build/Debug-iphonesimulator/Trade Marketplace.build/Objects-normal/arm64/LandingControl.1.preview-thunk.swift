@_private(sourceFile: "LandingControl.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension LandingControl {
    @_dynamicReplacement(for: getHomeView()) private func __preview__getHomeView() {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/UserView/LandingControl.swift", line: 37)
        print (__designTimeString("#3524.[2].[2].[0].arg[0].value", fallback: "func"))
        selectedbutton = .home
        return
    
#sourceLocation()
    }
}

extension LandingControl {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/UserView/LandingControl.swift", line: 21)
        ZStack {
            Group{
                switch selectedbutton {
                case .login:
                    LoginView(selectedbutton: $selectedbutton)
                case .signup:
                    SignupView(selectedbutton: $selectedbutton)
                case .landing:
                    LandingView(selectedbutton: $selectedbutton)
                case    .home:
                    TabBar()
                }
            }
        }
    
#sourceLocation()
    }
}

import enum Trade_Marketplace.Views
import struct Trade_Marketplace.LandingControl
