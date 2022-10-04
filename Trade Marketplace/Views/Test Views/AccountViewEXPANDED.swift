//
//  AccountViewEXPANDED.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//
import SwiftUI

struct AccountViewEXPANDED: View {
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
                TabButtonExpanded(headline: "Latest Recieved Quotes")
                TabButtonExpanded(headline: "My Listings")
                TabButtonExpanded(headline: "Sent Quotes")
                
            }
            }.ignoresSafeArea()
        }
    }
}

struct AccountViewEXPANDED_Previews: PreviewProvider {
    static var previews: some View {
        AccountViewEXPANDED()
    }
}

struct TabButtonExpanded: View {
    @State var headline = ""
    @State var subheadline = ""
    var body: some View {
        RoundedRectangle(cornerRadius: 30)
            .foregroundColor(.white)
            .frame(width: .infinity, height: 255)
            .shadow(color: .gray, radius: 4, x: 0, y: 4)
            .overlay(
                VStack(spacing: 10){
                    HStack {
                        Text("\(headline)")
                            .frame(width: 300, height: 24, alignment: .leading)
                        .font(.custom("Poppins-SemiBold", size: 24))
                        Image(systemName: "arrow.right")
                            .resizable()
                            .frame(width: 27, height: 27)
                    }
                    HStack(spacing: 10) {
                        PDFQuote(timeago: "1 Hours Ago")
                        PDFQuote(timeago: "4 Hours Ago")
                        PDFQuote(timeago: "12 Hours Ago")
                    }
                }
                    .frame(height: 205, alignment: .topLeading)
                    .padding(20)
            )
    }
}
