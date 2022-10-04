//
//  AccouuntView.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//

import SwiftUI

struct AccountView: View {
    var body: some View {
        ZStack{
            Rectangle()
                .foregroundColor(.gray)
                .opacity(0.3)
                .ignoresSafeArea()
            VStack{
                NavigatorAcc(text: "Hello, John Andrew")
            ScrollView{
                Uploadajobacc()
                Items()
            }            
            }.ignoresSafeArea()
        }
    }
}

struct AccountView_Previews: PreviewProvider {
    static var previews: some View {
        AccountView()
    }
}

struct Items: View {
    var body: some View {
        VStack{
            TabButtonAcc(headline: "Latest Recieved Quotes", subheadline: "you have no quotes")
            TabButtonAcc(headline: "My Listings", subheadline: "you have not made any listings or jobs")
            TabButtonAcc(headline: "Sent Quotes", subheadline: "you have not sent any quotes")
        }
    }
}
