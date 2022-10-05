@_private(sourceFile: "LandingControl.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension LandingControl_Previews {
    @_dynamicReplacement(for: previews) private static var __preview__previews: some View {
        #sourceLocation(file: "/Users/williamlarsen/Desktop/Trade Marketplace/Trade Marketplace/Trade Marketplace/UserView/LandingControl.swift", line: 37)
        __designTimeSelection(LandingControl(), "#5859.[3].[0].property.[0].[0]")
   #sourceLocation()
    }
}

extension LandingControl {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Users/williamlarsen/Desktop/Trade Marketplace/Trade Marketplace/Trade Marketplace/UserView/LandingControl.swift", line: 19)
        __designTimeSelection(ZStack {
            __designTimeSelection(Group{
                switch selectedbutton {
                case .login:
                    __designTimeSelection(LoginView(selectedbutton: __designTimeSelection($selectedbutton, "#5859.[2].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[0].[0].[0].arg[0].value")), "#5859.[2].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[0].[0].[0]")
                case .signup:
                    __designTimeSelection(SignupView(selectedbutton: __designTimeSelection($selectedbutton, "#5859.[2].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[0].[1].[0].arg[0].value")), "#5859.[2].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[0].[1].[0]")
                case .landing:
                    __designTimeSelection(LandingView(selectedbutton: __designTimeSelection($selectedbutton, "#5859.[2].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[0].[2].[0].arg[0].value")), "#5859.[2].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[0].[2].[0]")
                
                }
            }, "#5859.[2].[1].property.[0].[0].arg[0].value.[0]")
        }, "#5859.[2].[1].property.[0].[0]")
    #sourceLocation()
    }
}

import enum Trade_Marketplace.Views
import struct Trade_Marketplace.LandingControl
import struct Trade_Marketplace.LandingControl_Previews