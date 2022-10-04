//
//  ReviewQuoteView.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//

import SwiftUI

struct ReviewQuoteView: View {
    @State var Price = String()
@State var Currency = String()
    var body: some View {
        VStack{
            Spacer()
            Rectangle()
                .cornerRadius(30)
                .frame(height: 640)
                .foregroundColor(.white)
                .shadow(color: .gray, radius: 4, x: 0, y: 0)
                .overlay(VStack(spacing: 5){
                    Text("Sub Wiring")
                        .font(.custom("Poppins-SemiBold", size: 28))
                        .frame(width: 351, alignment: .leading)
                    
                    ProfileSub()
                    
                    Text("$\(Price) \(Currency)")
                        .font(.custom("Poppins-SemiBold", size: 28))
                        .frame(width: 351, alignment: .leading)
                    Text("Details")
                        .font(.custom("Poppins-SemiBold", size: 20))
                        .frame(width: 351, alignment: .leading)
                    Text("Placeholder text")
                        .font(.custom("Poppins-SemiBold", size: 16))
                        .frame(width: 351, alignment: .leading)
                        .foregroundColor(.gray)
                    HStack{
                        PDFQuote(timeago: "1 Hours Ago")
                        Spacer()
                    } .frame(width: 321, alignment: .leading)
                    Text("John Andrew, Can come to you on Monday at 1.30pm")
                        .font(.custom("Poppins-SemiBold", size: 20))
                        .frame(width: 321, alignment: .leading)
                    ReviewQuoteButton()
                }.frame(width: .infinity, height: .infinity, alignment: .bottom))
        }.ignoresSafeArea()
    }
}

struct ReviewQuoteView_Previews: PreviewProvider {
    static var previews: some View {
        RecievedQuoteView(Price: "50.00", Currency: "NZD")
    }
}


struct AcceptQuoteButton: View {
    var body: some View {
            RoundedRectangle(cornerRadius: 11)
            .foregroundColor(Color("logogreen"))
                .frame(width: 324, height: 61)
                .shadow(color: .gray, radius: 4, x: 0, y: 4)
                .overlay(
                                Text("Accept Quote")
                                    .frame(width: 300, height: 28, alignment: .center)
                                    .font(.custom("Poppins-SemiBold", size: 28))
                                    .foregroundColor(.white)
                        )
        }
    }

